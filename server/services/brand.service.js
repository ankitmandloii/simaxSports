const allBrandsNameSchema = require("../model/allBrandsNameSchema");
const AllBrandsName = require("../model/allBrandsNameSchema");

exports.addBrands = async (data) => {
    const alldata = data.map(async(element) => {
        return await allBrandsNameSchema.create({Name:element.Name});
    });
    return alldata;
};

exports.getAllBrands = async () => {
    return await AllBrandsName.find();
};