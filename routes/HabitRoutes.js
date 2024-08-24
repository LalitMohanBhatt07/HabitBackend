const express=require("express")
const router=express.Router()

const {createHabit,logCompletion,getHabits,deleteHabit}=require("../controllers/Habit")

router.post('/createHabit',createHabit)
router.post('/habits/:id/log', logCompletion);
router.get('/habits', getHabits);
router.delete('/habits/:id',deleteHabit); 
module.exports=router