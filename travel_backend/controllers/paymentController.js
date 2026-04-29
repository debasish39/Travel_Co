import Razorpay from 'razorpay';
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});
export const createOrder=async(req,res)=>{
    try{
        const {amount}=req.body;//In rupees
        const options={
            amount:amount*100,//paise
            currency:"INR",
            receipt:`rcpt_${Date.now()}`,
        };
        const order=await razorpay.orders.create(options);
        res.json({
            success:true,
            order,
            key:process.env.RAZORPAY_KEY_ID,
        });
        
    }catch(error){
        res.status(500).json({success:false,message:"Server Error",error:error.message});
    }
}


export const verifyPayment = (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false });
  }
};