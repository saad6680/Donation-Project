
// add footer in index.html
fetch('../Footer/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });

//----------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const image = document.querySelector('#imageSrc');
    const title = document.querySelector('#title');
    const description = document.querySelector('#description');
    const minSalary = document.querySelector('#minSalary');
    const maxSalary = document.querySelector('#maxSalary');
    const submitBtn = document.querySelector('#campSubmit');

    
    function clearInputsCreateCampaigns() {
        image.value = '';
        title.value = '';
        description.value = '';
        minSalary.value = '';
        maxSalary.value = '';
    }

    function handleErrorsInputs() {
        if (
            image.value.trim() === '' ||
            title.value.trim() === '' ||
            description.value.trim() === '' ||
            minSalary.value.trim() === '' ||
            maxSalary.value.trim() === ''
        ) {
            pError.style.display = 'block';
            return true;
        }
        return false;
    }

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();


        const hasError = handleErrorsInputs();
        if (hasError) {
            alert('Please fill in all fields');
            return;
        }

        const campaignData = {
            image: image.value,
            title: title.value,
            description: description.value,
            minSalary: minSalary.value,
            maxSalary: maxSalary.value,
            role: 'campaigner',
            isActive: true
        };

        fetch('http://localhost:3000/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campaignData)
        })
            .then(res => res.json())
            .then(data => {

                console.log('Campaign added:', data);
                clearInputsCreateCampaigns();
                window.location.href = '../Campagins/campagins.html';
                alert('The Campaign Under Review');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('An error occurred while submitting.');
            });
    });
});