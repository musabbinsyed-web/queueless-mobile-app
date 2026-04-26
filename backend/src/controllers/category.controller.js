const Category = require('../models/Category');
const Provider = require('../models/Provider');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

exports.getProvidersByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const providers = await Provider.find({ categoryId }).select('-services -queue');
    res.status(200).json(providers);
  } catch (error) {
    console.error('Error fetching providers by category:', error);
    res.status(500).json({ message: 'Server error fetching providers' });
  }
};
