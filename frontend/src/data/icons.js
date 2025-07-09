
// const icons = {
//     delete:
//         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='31' fill='%23fff' stroke='%23ccc' stroke-width='2'/%3E%3Cpath fill='%23666' d='M24 20v-2a2 2 0 012-2h12a2 2 0 012 2v2h8v4H16v-4h8zm2 0h12v-2H26v2zm-4 6h20l-2 24H24l-2-24z'/%3E%3C/svg%3E",
//     rotate:
//         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' cx='32' cy='32' r='32'/%3E%3Cpath fill='%23666666' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",
//     resize:
//         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NCA0NEgzNnY0aDh2LThoLTRaTTIwIDIwaDh2LTRoLTh2OGg0WiIvPjwvc3ZnPg==",
//     layer:
//         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0xNiAzNmwxNiAxMCAxNi0xMC0xNi0xMC0xNiAxMHptMC02bDE2LTEwIDE2IDEwLTE2IDEwLTE2LTEweiIvPjwvc3ZnPg==",
//     width:
//         "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyOSAyNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjkiIGhlaWdodD0iMjciIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI3IiBoZWlnaHQ9IjI1IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iNSwxMy41IDExLDkgMTEsMTgiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjI0LDEzLjUgMTgsOSAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
//     height: 
//         "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNyAyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjciIGhlaWdodD0iMjkiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTMuNSw1IDksMTEgMTgsMTEiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjUsMjQgOSwxOCAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
//     layerUp:
//     "data:image/svg+xml,%3Csvg width='27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
//   layerDown:
//     "data:image/svg+xml,%3Csvg width='a27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
//   layerTop:
//     "data:image/svg+xml,%3Csvg width='27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
//   layerBottom:
//     "data:image/svg+xml,%3Csvg width='27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
// };

// export default icons;



const svgRotateIcon = encodeURIComponent(`
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="24" fill="white" stroke="black" stroke-width="2"/>
  <path d="M13.245 20.0459C12.9819 20.0122 12.743 19.8753 12.5809 19.6654C12.4188 19.4555 12.3467 19.1898 12.3804 18.9267L13.3991 10.9919C13.4329 10.7288 13.5698 10.4899 13.7796 10.3278C13.9895 10.1657 14.2552 10.0936 14.5183 10.1273L22.4532 11.146C22.7162 11.1798 22.9551 11.3167 23.1172 11.5265C23.2794 11.7364 23.3515 12.0021 23.3177 12.2652C23.2839 12.5282 23.147 12.7671 22.9371 12.9292C22.7273 13.0914 22.4616 13.1635 22.1985 13.1297L16.658 12.4184L23.8275 21.6999C23.9842 21.9102 24.052 22.1735 24.0163 22.4333C23.9807 22.6931 23.8444 22.9285 23.6369 23.0888C23.4294 23.249 23.1672 23.3214 22.9069 23.2903C22.6465 23.2592 22.4088 23.127 22.245 22.9223L15.0754 13.6409L14.3642 19.1814C14.3304 19.4445 14.1935 19.6833 13.9836 19.8455C13.7737 20.0076 13.508 20.0797 13.245 20.0459Z" fill="black"/>
  <path d="M36.4238 30.1638C36.6869 30.1976 36.9257 30.3344 37.0879 30.5443C37.25 30.7542 37.3221 31.0199 37.2883 31.283L36.2697 39.2179C36.2359 39.4809 36.099 39.7198 35.8891 39.8819C35.6792 40.044 35.4135 40.1162 35.1505 40.0824L27.2156 39.0637C26.9525 39.0299 26.7137 38.8931 26.5515 38.6832C26.3894 38.4733 26.3173 38.2076 26.3511 37.9445C26.3848 37.6815 26.5217 37.4426 26.7316 37.2805C26.9415 37.1183 27.2072 37.0462 27.4703 37.08L33.0108 37.7913L25.8413 28.5098C25.6846 28.2996 25.6168 28.0362 25.6524 27.7764C25.6881 27.5166 25.8243 27.2812 26.0318 27.121C26.2394 26.9607 26.5015 26.8883 26.7619 26.9194C27.0222 26.9505 27.2599 27.0827 27.4238 27.2874L34.5933 36.5688L35.3046 31.0283C35.3384 30.7652 35.4753 30.5264 35.6852 30.3643C35.895 30.2021 36.1607 30.13 36.4238 30.1638Z" fill="black"/>
</svg>
`);


const svgRotateIcon2 = encodeURIComponent(`
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="24" fill="white" stroke="black" stroke-width="2"/>
  <g clip-path="url(#clip0)">
    <path d="M36.7528 30.5088C36.5626 30.6092 36.3403 30.6301 36.1347 30.5669C35.9291 30.5037 35.7569 30.3616 35.656 30.1716L34.3438 27.6569C32.9788 33.5313 26.3406 37.3947 20.4378 35.4163C18.2288 34.7093 16.3007 33.3202 14.9306 31.4487C13.5605 29.5771 12.819 27.3195 12.8125 25C12.7394 16.1519 23.1272 10.891 30.2 16.1966C30.3663 16.3269 30.4752 16.5168 30.5038 16.7261C30.5324 16.9354 30.4784 17.1476 30.3531 17.3177C30.2279 17.4878 30.0414 17.6025 29.8331 17.6374C29.6248 17.6723 29.411 17.6247 29.2372 17.5047C27.8521 16.4867 26.2117 15.8727 24.4986 15.731C22.7854 15.5894 21.0665 15.9255 19.5329 16.7022C17.9994 17.4789 16.7112 18.6656 15.8117 20.1305C14.9122 21.5954 14.4365 23.281 14.4375 25C14.4443 26.9756 15.0771 28.8982 16.2449 30.4916C17.4128 32.085 19.0557 33.2672 20.9375 33.8685C26.2756 35.6519 32.211 31.8778 32.9381 26.4016L29.4363 28.25C29.2456 28.3508 29.0226 28.3716 28.8166 28.308C28.6105 28.2444 28.4381 28.1015 28.3374 27.9108C28.2366 27.7201 28.2158 27.4972 28.2794 27.2911C28.343 27.085 28.4859 26.9126 28.6766 26.8119L33.4663 24.285C33.5609 24.2348 33.6645 24.2038 33.7712 24.1938C33.8778 24.1838 33.9854 24.1949 34.0877 24.2266C34.19 24.2584 34.2851 24.31 34.3674 24.3786C34.4497 24.4472 34.5176 24.5313 34.5672 24.6263L37.0941 29.416C37.1929 29.6063 37.2125 29.828 37.1486 30.0327C37.0847 30.2374 36.9424 30.4085 36.7528 30.5088Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0">
      <rect width="26" height="26" fill="white" transform="matrix(1 0 0 -1 12 38)"/>
    </clipPath>
  </defs>
</svg>
`);
const layerIcon = encodeURIComponent(`
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="25" cy="25" r="25" fill="white"></circle>
<path d="M10.93 28.36C10.93 28.54 11.025 28.705 11.18 28.795L24.7 36.6C24.775 36.645 24.865 36.665 24.95 36.665C25.035 36.665 25.12 36.645 25.2 36.6L38.82 28.74C38.975 28.65 39.07 28.485 39.07 28.305C39.07 28.125 38.975 27.96 38.82 27.87L33.795 24.975L38.82 22.075C38.975 21.985 39.07 21.82 39.07 21.64C39.07 21.46 38.975 21.295 38.82 21.205L25.3 13.4C25.145 13.31 24.955 13.31 24.8 13.4L11.18 21.265C11.025 21.355 10.93 21.52 10.93 21.695C10.93 21.875 11.025 22.04 11.18 22.13L16.205 25.03L11.18 27.925C11.025 28.015 10.93 28.18 10.93 28.36ZM12.43 21.695L25.05 14.41L37.57 21.64L32.57 24.525C32.56 24.53 32.545 24.535 32.535 24.545L24.95 28.925L23.275 27.96C23.24 27.935 23.205 27.915 23.17 27.9L17.45 24.595L12.43 21.695Z" fill="black"></path>
</svg>
`);

const deletee = encodeURIComponent(`
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="25" cy="25" r="25" fill="white"></circle>
<g clip-path="url(#clip0_12_132)">
<path d="M28.3104 21.6953C28 21.6953 27.7484 21.9469 27.7484 22.2573V32.8802C27.7484 33.1905 28 33.4423 28.3104 33.4423C28.6209 33.4423 28.8725 33.1905 28.8725 32.8802V22.2573C28.8725 21.9469 28.6209 21.6953 28.3104 21.6953Z" fill="black"></path>
<path d="M21.6781 21.6953C21.3677 21.6953 21.1161 21.9469 21.1161 22.2573V32.8802C21.1161 33.1905 21.3677 33.4423 21.6781 33.4423C21.9886 33.4423 22.2402 33.1905 22.2402 32.8802V22.2573C22.2402 21.9469 21.9886 21.6953 21.6781 21.6953Z" fill="black"></path>
<path d="M16.8444 20.145V33.9929C16.8444 34.8114 17.1446 35.5801 17.6689 36.1316C18.1908 36.6847 18.917 36.9986 19.6771 36.9999H30.3115C31.0718 36.9986 31.7981 36.6847 32.3197 36.1316C32.844 35.5801 33.1442 34.8114 33.1442 33.9929V20.145C34.1864 19.8683 34.8617 18.8615 34.7223 17.792C34.5827 16.7228 33.6718 15.9229 32.5933 15.9227H29.7156V15.2201C29.7189 14.6293 29.4853 14.062 29.067 13.6446C28.6488 13.2275 28.0806 12.9952 27.4898 13H22.4988C21.908 12.9952 21.3398 13.2275 20.9216 13.6446C20.5033 14.062 20.2697 14.6293 20.273 15.2201V15.9227H17.3953C16.3169 15.9229 15.4059 16.7228 15.2663 17.792C15.1269 18.8615 15.8022 19.8683 16.8444 20.145ZM30.3115 35.8758H19.6771C18.7161 35.8758 17.9686 35.0503 17.9686 33.9929V20.1944H32.02V33.9929C32.02 35.0503 31.2725 35.8758 30.3115 35.8758ZM21.3971 15.2201C21.3934 14.9275 21.5084 14.6458 21.7161 14.4392C21.9236 14.2326 22.206 14.1191 22.4988 14.1241H27.4898C27.7826 14.1191 28.065 14.2326 28.2725 14.4392C28.4802 14.6456 28.5952 14.9275 28.5915 15.2201V15.9227H21.3971V15.2201ZM17.3953 17.0468H32.5933C33.1521 17.0468 33.605 17.4998 33.605 18.0585C33.605 18.6173 33.1521 19.0703 32.5933 19.0703H17.3953C16.8365 19.0703 16.3836 18.6173 16.3836 18.0585C16.3836 17.4998 16.8365 17.0468 17.3953 17.0468Z" fill="black"></path>
<path d="M24.9943 21.6953C24.6839 21.6953 24.4323 21.9469 24.4323 22.2573V32.8802C24.4323 33.1905 24.6839 33.4423 24.9943 33.4423C25.3048 33.4423 25.5564 33.1905 25.5564 32.8802V22.2573C25.5564 21.9469 25.3048 21.6953 24.9943 21.6953Z" fill="black"></path>
</g>
<defs>
<clipPath id="clip0_12_132">
<rect width="24" height="24" fill="white" transform="translate(13 13)"></rect>
</clipPath>
</defs>
</svg>
`);
const resizeIcon = `data:image/svg+xml;charset=utf-8,${svgRotateIcon} `
const rotateIcon2 = `data:image/svg+xml;charset=utf-8,${svgRotateIcon2} `
const layerIconn = `data:image/svg+xml;charset=utf-8,${layerIcon} `
const deleteIconn = `data:image/svg+xml;charset=utf-8,${deletee} `



const icons = {

  delete:
    deleteIconn,
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cline x1='20' y1='20' x2='44' y2='44' stroke='%23000' stroke-width='4'/%3E%3Cline x1='44' y1='20' x2='20' y2='44' stroke='%23000' stroke-width='4'/%3E%3C/svg%3E",
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' fill='none'%3E%3Ccircle cx='25' cy='25' r='25' fill='white'/%3E%3Cg clip-path='url(%23clip0_12_132)'%3E%3Cpath d='M28.3104 21.6953C28 21.6953 27.7484 21.9469 27.7484 22.2573V32.8802C27.7484 33.1905 28 33.4423 28.3104 33.4423C28.6209 33.4423 28.8725 33.1905 28.8725 32.8802V22.2573C28.8725 21.9469 28.6209 21.6953 28.3104 21.6953Z' fill='black'/%3E%3Cpath d='M21.6781 21.6953C21.3677 21.6953 21.1161 21.9469 21.1161 22.2573V32.8802C21.1161 33.1905 21.3677 33.4423 21.6781 33.4423C21.9886 33.4423 22.2402 33.1905 22.2402 32.8802V22.2573C22.2402 21.9469 21.9886 21.6953 21.6781 21.6953Z' fill='black'/%3E%3Cpath d='M16.8444 20.145V33.9929C16.8444 34.8114 17.1446 35.5801 17.6689 36.1316C18.1908 36.6847 18.917 36.9986 19.6771 36.9999H30.3115C31.0718 36.9986 31.7981 36.6847 32.3197 36.1316C32.844 35.5801 33.1442 34.8114 33.1442 33.9929V20.145C34.1864 19.8683 34.8617 18.8615 34.7223 17.792C34.5827 16.7228 33.6718 15.9229 32.5933 15.9227H29.7156V15.2201C29.7189 14.6293 29.4853 14.062 29.067 13.6446C28.6488 13.2275 28.0806 12.9952 27.4898 13H22.4988C21.908 12.9952 21.3398 13.2275 20.9216 13.6446C20.5033 14.062 20.2697 14.6293 20.273 15.2201V15.9227H17.3953C16.3169 15.9229 15.4059 16.7228 15.2663 17.792C15.1269 18.8615 15.8022 19.8683 16.8444 20.145ZM30.3115 35.8758H19.6771C18.7161 35.8758 17.9686 35.0503 17.9686 33.9929V20.1944H32.02V33.9929C32.02 35.0503 31.2725 35.8758 30.3115 35.8758ZM21.3971 15.2201C21.3934 14.9275 21.5084 14.6458 21.7161 14.4392C21.9236 14.2326 22.206 14.1191 22.4988 14.1241H27.4898C27.7826 14.1191 28.065 14.2326 28.2725 14.4392C28.4802 14.6456 28.5952 14.9275 28.5915 15.2201V15.9227H21.3971V15.2201ZM17.3953 17.0468H32.5933C33.1521 17.0468 33.605 17.4998 33.605 18.0585C33.605 18.6173 33.1521 19.0703 32.5933 19.0703H17.3953C16.8365 19.0703 16.3836 18.6173 16.3836 18.0585C16.3836 17.4998 16.8365 17.0468 17.3953 17.0468Z' fill='black'/%3E%3Cpath d='M24.9943 21.6953C24.6839 21.6953 24.4323 21.9469 24.4323 22.2573V32.8802C24.4323 33.1905 24.6839 33.4423 24.9943 33.4423C25.3048 33.4423 25.5564 33.1905 25.5564 32.8802V22.2573C25.5564 21.9469 25.3048 21.6953 24.9943 21.6953Z' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_12_132'%3E%3Crect width='24' height='24' fill='white' transform='translate(13 13)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E",
  rotate:
    rotateIcon2,
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' cx='32' cy='32' r='32'/%3E%3Cpath fill='%23000' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",

  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath fill='%23000' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",

  resize:
    resizeIcon,
  // "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NCA0NEgzNnY0aDh2LThoLTRaTTIwIDIwaDh2LTRoLTh2OGg0WiIvPjwvc3ZnPg==",

  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath fill='%23000' d='M20 20h4v-4h-8v8h4v-4zm20 20h-4v4h8v-8h-4v4z'/%3E%3C/svg%3E",

  layer:
    layerIconn,
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath fill='%23000' d='M32 16l16 8-16 8-16-8 16-8zm0 20l16-8v4l-16 8-16-8v-4l16 8zm0 8l16-8v4l-16 8-16-8v-4l16 8z'/%3E%3C/svg%3E",

  width:

    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath stroke='%23000' stroke-width='2' fill='none' d='M16 32h32M20 28l-8 4 8 4M44 28l8 4-8 4'/%3E%3C/svg%3E",

  height:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath stroke='%23000' stroke-width='2' fill='none' d='M32 16v32M28 20l4-8 4 8M28 44l4 8 4-8'/%3E%3C/svg%3E",

  layerUp:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,16 24,28 40,28'/%3E%3C/svg%3E",

  layerDown:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,48 24,36 40,36'/%3E%3C/svg%3E",

  layerTop:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,12 24,24 40,24'/%3E%3C/svg%3E",

  layerBottom:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,52 24,40 40,40'/%3E%3C/svg%3E",

};


export default icons;
