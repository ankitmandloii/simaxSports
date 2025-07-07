const axios = require("axios");
const StyleId = require("../model/Style");
const specSchema = require("../model/specSchema");
const SSProductMapping = require("../model/SSProductMapping");



const getAuthHeader = () => {
  const username = process.env.SS_USER_NAME;
  const password = process.env.SS_PASSWORD;
  const base64Auth = Buffer.from(`${username}:${password}`).toString("base64");
  return {
    Authorization: `Basic ${base64Auth}`,
  };
};

exports.fetchAllStyleIdsFromSandS = async () => {
  try {
    const response = await axios.get(`${process.env.SS_API_URL}/styles`, {
      headers: getAuthHeader(),
    });

    const styles = response.data;
    // console.log("styles",styles)
    const styleIds = styles.map((s) => s.styleID);
    //[39,8263,7956];
    // const styleIds = [39];

    // console.log(`[S&S] Total styles fetched: ${styleIds.length}`);
    return styleIds;
  } catch (error) {
    console.error("Error fetching style IDs:", error.message);
    throw error;
  }
};


exports.fetchAllStyleIdsFromDB = async () => {
  try {
    const styles = await StyleId.find({}, { styleId: 1, _id: 0 }); // Only return styleId
    const styleIds = styles.map((s) => s.styleId);
    return styleIds;
  } catch (error) {
    console.error("Error fetching style IDs from DB:", error.message);
    throw error;
  }
};



const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.fetchSSProductsByStyleIds = async (styleIds) => {
  try {
    const allProducts = [];

    for (const styleId of styleIds) {
      const response = await axios.get(`${process.env.SS_API_URL}/products`, {
        headers: getAuthHeader(),
        params: {
          styleid: styleId,
        },
      });

      const products = response.data;
      allProducts.push(...products);
      console.log(`[S&S] Fetched styleID ${styleId} with ${products.length} SKUs`);
      await delay(1000);
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching S&S products by styleID:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
};



exports.fetchSSpecsByStyleId = async (styleId) => {
  try {

    const response = await axios.get(`${process.env.SS_API_URL}/specs/?style=${styleId}`, {
      headers: getAuthHeader()
    });

    const specs = response.data || [];


    return specs;
  } catch (error) {
    console.error("Error fetching S&S Specs by styleID:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
};


exports.fetchSSInventoryByStyleId = async (styleId) => {
  try {

    const response = await axios.get(`${process.env.SS_API_URL}/inventory?style=${styleId}`, {
      headers: getAuthHeader()
    });

    const inventory = response.data || [];
    return inventory;
  } catch (error) {
    console.error("Error fetching S&S Inventory:", error.response?.status, error.response?.data || error.message);
    throw error;
  }

};


exports.getProductsFromDb = async (styleId) => {
  try {

    const response =  SSProductMapping.find().lean();

    const productData = response || [];
    return productData;
  } catch (error) {
    console.error("Error fetching productData:", error.response?.status, error.response?.data || error.message);
    throw error;
  }

};