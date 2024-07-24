const router = require("express").Router();

const userManager = require("../managers/userManager");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, userId } = await userManager.register({
      email,
      password,
    });

    await userManager.createUserShippingDetails({ _id: userId });

    // sendRegistrationEmail(email);

    res.status(201).json({ token, userId });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = { ...req.body };

  try {
    const result = await userManager.login({ email, password });

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      message: err.message,
    });
  }
});

router.get("/logout", (req, res) => {
  res.end();
});

router.put("/update-email/:userId", async (req, res) => {
  const userId = req.params.userId;

  const data = { ...req.body };

  try {
    const result = await userManager.updateEmail(userId, data);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      message: err.message,
    });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await userManager.getUser(userId);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: err.message,
    });
  }
});

router.put("/update-password/:userId", async (req, res) => {
  const userId = req.params.userId;

  const data = { ...req.body };

  try {
    const result = await userManager.updatePassword(userId, data);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      message: err.message,
    });
  }
});

module.exports = router;