const env = require("dotenv");
env.config();

function extractName(email) {
  let namePart = email.split("@")[0];  // Get the part before '@'
  let formattedName = namePart.replace(/[\.\-_]/g, " ")  // Replace dots, hyphens, underscores with spaces
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
  return formattedName;
}

exports.sendEmailTamplate = (customerEmail,companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link) => {

  // const userName = extractName(customerEmail);
  const designName = designname || "";
  const data = {
    from: process.env.SMTP_USER,
    to: `${customerEmail}`,
    subject: `Your Design ${designName} has been updated!`,
    html: `
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4;">
    <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
      <tr>
        <td style="padding: 20px 0;">
          <img src="https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755783418078_image_4.png" alt="SimaxDesign Logo" style="display: block; margin: 0 auto; width: 150px;">
        </td>
      </tr>
      <tr>
        <td style="background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 24px; color: #333; text-align: center; margin-bottom: 20px;">We've Saved Your Design!</h1>
          <p style="font-size: 16px; color: #555; text-align: center; line-height: 1.5;">Your Design is really shaping up! Choose the right product to have it printed on, or jump in to the design studio and make your final edits.</p>
          <p style="font-size: 16px; color: #333; text-align: center; font-weight: bold; margin-top: 30px;">Design Name: ${designName}</p>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
            <tr>
              <td align="center" style="padding: 10px;">
                <img src=${frontSrc} alt="design_front" style="display: block; width: 250px; height: auto;">
              </td>
              <td align="center" style="padding: 10px;">
                <img src=${backSrc} alt="design_back" style="display: block; width: 250px; height: auto;">
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
            <tr>
              <td align="center" style="padding: 10px;">
                <a href="${edit_design_link}" style="display: inline-block; padding: 12px 25px; background-color: #005bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Edit Design</a>
              </td>
              <td align="center" style="padding: 10px;">
                <a href="${add_to_cart_link}" style="display: inline-block; padding: 12px 25px; background-color: #005bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Add To Cart</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color: #e6e6e6; padding: 20px; text-align: center; margin-top: 20px; border-radius: 10px;">
          <p style="font-size: 16px; color: #555; margin-bottom: 10px;">We're here to help you 7 days a week</p>
          <p style="font-size: 16px; color: #555;">Call <a href="tel:${phoneNumber}" style="color: #007bff; text-decoration: none;">${phoneNumber}</a> or email <a href="mailto:${companyEmail}" style="color: #007bff; text-decoration: none;">${companyEmail}</a> to chat with an expert now & create your masterpiece!</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #FFFFFFFF; padding: 20px; text-align: center;">
          <img src="https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755783418078_image_4.png" alt="SimaxDesign Footer Logo" style="display: block; margin: 0 auto; width: 120px; margin-bottom: 15px;">
          <p style="font-size: 12px; color: #ccc; margin-bottom: 5px;">SimaxDesign by Simax Transfers</p>
          <p style="font-size: 12px; color: #ccc; margin-bottom: 15px;">2/27 Commerce Way, Suite 100, Philadelphia, PA 19154</p>
          <p style="font-size: 12px; color: #ccc;">This message was sent to <a href="mailto:${customerEmail}" style="color: #007bff; text-decoration: none;">${customerEmail}</a></p>
          <p style="font-size: 12px; color: #ccc;">No longer interested? <a href="${unsubscribe_link}" style="color: #007bff; text-decoration: none;">Unsubscribe</a></p>
        </td>
      </tr>
    </table>
  </body>
`,
  };

  return data;
};



function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function subjectFrom(d) {
  const id = d.order.order_number || d.order.name || d.order.id;
  const amount = d.totals.total ? `${d.totals.total} ${d.totals.currency}` : '';
  const prefix = d.meta.shop_domain ? `[${d.meta.shop_domain}] ` : '';
  if (d.order.cancelled_at) return `${prefix}Order CANCELLED ${id} — ${amount}`;
  if ((d.order.financial_status || '').toLowerCase() === 'paid') return `${prefix}Payment RECEIVED ${id} — ${amount}`;
  if (d.order.financial_status) return `${prefix}Order ${id} — ${String(d.order.financial_status).toUpperCase()} ${amount}`;
  return `${prefix}Order ${id}`;
}

function renderHtml(d) {
  const addr = (a) =>
    a
      ? `${esc(a.first_name || '')} ${esc(a.last_name || '')}<br>${esc(a.address1 || '')}${
          a.address2 ? `<br>${esc(a.address2)}` : ''
        }<br>${esc(a.city || '')}, ${esc(a.province || '')} ${esc(a.zip || '')}<br>${esc(a.country || '')}`
      : '—';

  const itemRows =
    d.items.length === 0
      ? '<tr><td colspan="7" style="padding:8px;border:1px solid #eee;">No items</td></tr>'
      : d.items
          .map((li) => {
            const preview = li.preview_image
              ? `<img src="${esc(li.preview_image)}" alt="Preview" style="height:48px;width:48px;object-fit:cover;border-radius:4px;" />`
              : '—';

            const imagesList = (li.design_images || [])
              .map(di => `<a href="${esc(di.url)}" style="margin-right:8px;text-decoration:none;color:#0b5fff;">${esc(di.label || 'Design')}</a>`)
              .join('');

            return `
<tr>
  <td style="padding:8px;border:1px solid #eee;">${preview}</td>
  <td style="padding:8px;border:1px solid #eee;">${esc(li.title || '')}<div style="color:#999;font-size:12px;">ID: ${esc(li.line_item_id || '')}</div></td>
  <td style="padding:8px;border:1px solid #eee;">${esc(li.sku || '')}</td>
  <td style="padding:8px;border:1px solid #eee;text-align:center;">${esc(li.quantity)}</td>
  <td style="padding:8px;border:1px solid #eee;text-align:right;">${esc(li.unit_price)} ${esc(d.totals.currency)}</td>
  <td style="padding:8px;border:1px solid #eee;text-align:right;">${esc(li.line_total)} ${esc(d.totals.currency)}</td>
  <td style="padding:8px;border:1px solid #eee;">${esc(li.design_id || '—')}${imagesList ? `<div style="margin-top:6px;">${imagesList}</div>` : ''}</td>
</tr>`;
          })
          .join('');

  return `<!doctype html><html><body style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.45;">
  <h2 style="margin:0 0 8px 0;">${esc(subjectFrom(d))}</h2>
  <div style="color:#666;margin-bottom:12px;">Topic: ${esc(d.meta.topic || 'unknown')} • Shop: ${esc(d.meta.shop_domain || '')}${d.meta.test ? ' • TEST' : ''}</div>

  <table style="border-collapse:collapse;margin-bottom:14px;">
    <tr><td style="padding:6px 8px;color:#555;">Order</td><td style="padding:6px 8px;"><b>${esc(d.order.name || String(d.order.order_number || d.order.id || ''))}</b></td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Created</td><td style="padding:6px 8px;">${esc(d.order.created_at || '—')}</td></tr>
    ${d.order.cancelled_at ? `<tr><td style="padding:6px 8px;color:#b00020;">Cancelled</td><td style="padding:6px 8px;color:#b00020;">${esc(d.order.cancelled_at)} (${esc(d.order.cancel_reason || 'reason not provided')})</td></tr>` : ''}
    <tr><td style="padding:6px 8px;color:#555;">Financial</td><td style="padding:6px 8px;">${esc(d.order.financial_status || '—')}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Fulfillment</td><td style="padding:6px 8px;">${esc(d.order.fulfillment_status || '—')}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Customer</td><td style="padding:6px 8px;">${esc(d.customer?.name || '—')} &lt;${esc(d.customer?.email || '—')}&gt;</td></tr>
    ${d.order.order_status_url ? `<tr><td style="padding:6px 8px;color:#555;">Order Status URL</td><td style="padding:6px 8px;"><a href="${esc(d.order.order_status_url)}">${esc(d.order.order_status_url)}</a></td></tr>` : ''}
  </table>

  <table style="border-collapse:collapse;width:100%;margin-bottom:14px;">
    <thead>
      <tr>
        <th align="left"  style="padding:8px;border:1px solid #eee;background:#fafafa;">Preview</th>
        <th align="left"  style="padding:8px;border:1px solid #eee;background:#fafafa;">Item</th>
        <th align="left"  style="padding:8px;border:1px solid #eee;background:#fafafa;">SKU</th>
        <th align="center"style="padding:8px;border:1px solid #eee;background:#fafafa;">Qty</th>
        <th align="right" style="padding:8px;border:1px solid #eee;background:#fafafa;">Price</th>
        <th align="right" style="padding:8px;border:1px solid #eee;background:#fafafa;">Line Total</th>
        <th align="left"  style="padding:8px;border:1px solid #eee;background:#fafafa;">Design</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <table style="border-collapse:collapse;margin-bottom:14px;">
    <tr><td style="padding:6px 8px;color:#555;">Subtotal</td><td style="padding:6px 8px;text-align:right;">${esc(d.totals.subtotal)} ${esc(d.totals.currency)}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Shipping</td><td style="padding:6px 8px;text-align:right;">${esc(d.totals.shipping)} ${esc(d.totals.currency)}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Discounts</td><td style="padding:6px 8px;text-align:right;">-${esc(d.totals.discounts)} ${esc(d.totals.currency)}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;">Tax</td><td style="padding:6px 8px;text-align:right;">${esc(d.totals.tax)} ${esc(d.totals.currency)}</td></tr>
    <tr><td style="padding:6px 8px;color:#000;font-weight:600;">Total</td><td style="padding:6px 8px;text-align:right;font-weight:600;">${esc(d.totals.total)} ${esc(d.totals.currency)}</td></tr>
  </table>

  <table style="border-collapse:collapse;margin-bottom:14px;">
    <tr><td style="padding:6px 8px;color:#555;vertical-align:top;">Shipping Address</td><td style="padding:6px 8px;">${addr(d.addresses.shipping)}</td></tr>
    <tr><td style="padding:6px 8px;color:#555;vertical-align:top;">Billing Address</td><td style="padding:6px 8px;">${addr(d.addresses.billing)}</td></tr>
  </table>

  <div style="color:#999;font-size:12px;">Admin GraphQL ID: ${esc(d.order.admin_graphql_api_id || '')}</div>
</body></html>`;
}

function renderText(d) {
  const lines = [];
  lines.push(subjectFrom(d));
  lines.push(`Topic: ${d.meta.topic || 'unknown'}  Shop: ${d.meta.shop_domain || ''}${d.meta.test ? '  (TEST)' : ''}`);
  lines.push(`Order: ${d.order.name || d.order.order_number || d.order.id}`);
  lines.push(`Created: ${d.order.created_at || '—'}`);
  if (d.order.cancelled_at) lines.push(`Cancelled: ${d.order.cancelled_at} (${d.order.cancel_reason || '—'})`);
  lines.push(`Financial: ${d.order.financial_status || '—'}`);
  lines.push(`Fulfillment: ${d.order.fulfillment_status || '—'}`);
  lines.push(`Customer: ${d.customer?.name || '—'} <${d.customer?.email || '—'}>`);
  lines.push(`Subtotal: ${d.totals.subtotal} ${d.totals.currency}`);
  lines.push(`Shipping: ${d.totals.shipping} ${d.totals.currency}`);
  lines.push(`Discounts: -${d.totals.discounts} ${d.totals.currency}`);
  lines.push(`Tax: ${d.totals.tax} ${d.totals.currency}`);
  lines.push(`Total: ${d.totals.total} ${d.totals.currency}`);
  lines.push(`Items:`);
  for (const li of d.items) {
    lines.push(`  - ${li.title} (SKU ${li.sku || '—'}) x${li.quantity} @ ${li.unit_price} = ${li.line_total} ${d.totals.currency}`);
    if (li.design_id)   lines.push(`      Design ID: ${li.design_id}`);
    if (li.preview_image) lines.push(`      Preview: ${li.preview_image}`);
    for (const di of (li.design_images || [])) {
      lines.push(`      ${di.label || 'Design'}: ${di.url}`);
    }
  }
  if (d.order.order_status_url) lines.push(`Order status URL: ${d.order.order_status_url}`);
  return lines.join('\n');
}


exports.sendEmailToAdminWhileOrderTemplate = (emailData) => {
  const subject = subjectFrom(emailData);
  const html = renderHtml(emailData);
  const text = renderText(emailData);

  return {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,   // ✅ send to admin
    subject,
    html,
    text,
  };
};