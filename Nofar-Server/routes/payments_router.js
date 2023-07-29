const router = require('express').Router();


router.post('/pay', (req, res) => {
    
    const random = Math.floor(Math.random() * 10);
    const terminal_number = "123654789";
    const transaction_number = terminal_number + Date.now();
    const last_digits = req.body.credit_number.slice(-4);
    
    if (random % 2 == 0) {
        res.status(200).json({
            success:true,
            message: 'Payment Successful',
            terminal_number,
            transaction_number,
            last_digits
        })
    }
    else {
        res.status(500).json({
            success:false,
            error: 'Payment Failed'
        })
    }
})

module.exports = router;