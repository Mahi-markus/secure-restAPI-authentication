const { body } = require("express-validator");

const checkout_valid = [
    body("amount")
        .exists()
        .withMessage("Amount is required")
        .bail()
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number"),
    body("currency")
        .exists()
        .withMessage("Currency is required")
        .bail()
        .isLength({ min: 3, max: 3 })
        .withMessage("Currency must be a 3-letter code")
        .isAlpha()
        .withMessage("Currency must contain only letters"),
];

module.exports = { checkout_valid };
