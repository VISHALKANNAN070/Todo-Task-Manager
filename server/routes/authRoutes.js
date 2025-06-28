import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

res.cookie('token',token,{
  httpOnly:true,
  secure:false,
  sameSite:'None',
  maxAge:6*60*60*1000,
})

res.redirect("http://localhost:5173/dashboard")
  }
);

export default router;
