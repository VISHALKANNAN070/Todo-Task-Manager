import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import verifyToken from "../auth/verifyToken.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt:"select_account",
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure:true,
      sameSite: "None",
      maxAge: 6 * 60 * 60 * 1000,
    });
    
    res.redirect(process.env.FRONTEND_URL);
  }
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
      maxAge: 6 * 60 * 60 * 1000,
    });
    
    res.redirect(process.env.FRONTEND_URL);
  }
);

router.get("/user",verifyToken,(req,res)=>{
  res.status(200).json({userId:req.user._id})
})

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure:true,
  });
  res.status(200).json({message:"Logout Successful"})
});

export default router;
