import User from '../models/User.js';

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const { fullName, street, city, state, zipCode, country, isDefault } = req.body;
    
    if (!fullName || !street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ success: false, message: 'Please provide all address fields' });
    }

    const user = await User.findById(req.user._id);
    
    // If it's the first address, or isDefault is true, set others to false
    const newAddress = { fullName, street, city, state, zipCode, country, isDefault: isDefault || false };
    
    if (user.addresses.length === 0 || newAddress.isDefault) {
      newAddress.isDefault = true;
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(newAddress);
    await user.save();
    
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update address
// @route   PATCH /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);
    
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const { fullName, street, city, state, zipCode, country, isDefault } = req.body;
    
    if (fullName) address.fullName = fullName;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    
    if (isDefault !== undefined) {
      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }
      address.isDefault = isDefault;
    }
    
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    
    // If we deleted the default, make the first one default if it exists
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
