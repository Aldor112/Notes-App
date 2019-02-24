const express=require('express');
const router=express.Router();
const user=require('../models/users');
const passport=require('passport');

router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
});
router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash: true
}));

router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
});
router.post('/users/signup',async (req,res)=>{
   const {name, email, password,confirm_password}= req.body;
   const errors= [];
   if (name.length<= 0) {
       errors.push({text:'Name is empty'})
   }
   if (password.length<= 0 || confirm_password<=0) {
    errors.push({text:'Password is empty'})
}
   if (password!=confirm_password) {
       errors.push({text:'Password does not match'});
   }
   if (password.length < 4) {
       errors.push({text:'Password must be at least 4 characters'});
   }
   if (errors.length>0) {
       res.render('users/signup',{errors,name,email});
   }else{
  const emailUser=  await user.findOne({email:email});
  if (emailUser) {
      req.flash('error msg','Email already exist');
      res.redirect('/users/signup');
  }
    const NewUser=new user({name,email, password});
    NewUser.password=await NewUser.encryptPassword(password);
    await NewUser.save();
    req.flash('succes msg','You are Registered');
    res.redirect('/users/signin');
   }
    
});
router.get('/users/logout',(req,res)=>{
 req.logout();
 res.redirect('/');
});

module.exports=router;