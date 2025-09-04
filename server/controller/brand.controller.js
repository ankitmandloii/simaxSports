const brandService = require("../services/brand.service")

exports.addBrands = async (req, res) => {
    try {
        const { brandNames } = req.body;
        const brands = await brandService.addBrands(brandNames);
        res.status(201).json(brands);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await brandService.getAllBrands();
        res.json(brands);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};