
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

    let base64Image = "";


    function compressAndConvertToBase64(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = (error) => {
                    reject(error);
                };
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }
    document.getElementById('imageSrc')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Use compression and conversion
                base64Image = await compressAndConvertToBase64(file);
                console.log("Image compressed and converted to base64");
                // Optional: Show image size for debugging
                console.log(`Base64 image size: ~${Math.round(base64Image.length / 1024)} KB`);
            } catch (error) {
                console.error("Error processing image:", error);
                base64Image = "";
            }
        } else {
            base64Image = "";
        }
    });
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();


        const hasError = handleErrorsInputs();
        if (hasError) {
            alert('Please fill in all fields');
            return;
        }

        const campaignData = {
            image: base64Image,
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

                // window.location.href = '../Campagins/campagins.html';

                alert('The Campaign Under Review');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('An error occurred while submitting.');
            });
    });
});


    
