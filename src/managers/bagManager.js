const Bag = require("../models/Bag");
const Inventory = require("../models/Inventory");
const UserLoginDetails = require("../models/UserLoginDetails");

const {
  getAllBagItemsByUserId,
} = require("../aggregations/getAllBagItemsByUserId");

const { checkIfItemIsAvailable } = require("../utils/checkIfItemIsAvailable");

const {
  DEFAULT_ADD_QUANTITY,
  SOLD_OUT_JEWELRY_ERROR_MESSAGE,
} = require("../constants/bag");

exports.create = async ({ userId, jewelryId, size }) => {
  const isAvailable = await checkIfItemIsAvailable(jewelryId, size);

  if (!isAvailable) {
    throw new Error(SOLD_OUT_JEWELRY_ERROR_MESSAGE);
  }

  await Bag.create({
    user: userId,
    jewelry: jewelryId,
    size,
    quantity: DEFAULT_ADD_QUANTITY,
  });

  await Inventory.findOneAndUpdate(
    { jewelry: jewelryId, size },
    { $inc: { quantity: -DEFAULT_ADD_QUANTITY } },
    { new: true }
  );
};

exports.getAll = async (userId) => {
  const user = await UserLoginDetails.findById(userId);

  return getAllBagItemsByUserId(user);
};

exports.delete = async (bagId, inventoryId) => {
  await Bag.findByIdAndDelete(bagId);

  await Inventory.findByIdAndUpdate(
    inventoryId,
    { $inc: { quantity: +DEFAULT_ADD_QUANTITY } },
    { new: true }
  );
};
