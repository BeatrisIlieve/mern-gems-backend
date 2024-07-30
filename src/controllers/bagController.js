const router = require("express").Router();

const bagManager = require("../managers/bagManager");

const {
  DEFAULT_ADD_QUANTITY,
  NOT_SELECTED_SIZE_ERROR_MESSAGE,
  SOLD_OUT_JEWELRY_ERROR_MESSAGE,
} = require("../constants/bag");

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await bagManager.getAll(userId);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);

    res.status(401).json({
      message: err.message,
    });
  }
});

router.post("/create/:jewelryId", async (req, res) => {
  const { size } = req.body;

  const userId = req.user._id;

  const jewelryId = Number(req.params.jewelryId);

  try {
    if (!size) {
      throw new Error(NOT_SELECTED_SIZE_ERROR_MESSAGE);
    }

    const isAvailable = await bagManager.checkAvailability(jewelryId, size);

    if (!isAvailable) {
      throw new Error(SOLD_OUT_JEWELRY_ERROR_MESSAGE);
    }

    const sizeId = Number(size);

    const bagItem = await bagManager.getOne({
      userId,
      jewelryId,
      sizeId,
    });

    if (!bagItem) {
      await bagManager.create({
        userId,
        jewelryId,
        sizeId,
        quantity: DEFAULT_ADD_QUANTITY,
      });
    } else {
      await bagManager.increase(bagItem._id);
    }

    res.status(204).json();
  } catch (err) {
    console.log(err.message);

    res.status(401).json({
      message: err.message,
    });
  }
});

router.put("/decrease/:bagId", async (req, res) => {
  const bagId = req.params.bagId;

  try {
    await bagManager.decrease(bagId);

    res.status(204).json();
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
});

router.put("/increase/:bagId", async (req, res) => {
  const bagId = req.params.bagId;

  try {
    await bagManager.increase(bagId);

    res.status(204).json();
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
});

module.exports = router;
