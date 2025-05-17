window.addEventListener('load', function(){
    const submitBtn = document.querySelector('button[type="submit"]');
    const donationNum = document.querySelector('#validationDefault05');
    
    submitBtn.addEventListener('click', function(e){
        e.preventDefault();
        let donation = parseFloat(donationNum.value);
        console.log(donation);
        if (!isNaN(donation) && donation > 0) {
            let currentTotal = parseFloat(localStorage.getItem('donationTotal')) || 0;
            currentTotal += donation;
            localStorage.setItem('donationTotal', currentTotal);
            window.location.href = ''; // profile backer 
        }else {
            console.log('invalid donation');
            alert('please enter a valid donation')
            
        }
        
    })
    
})

