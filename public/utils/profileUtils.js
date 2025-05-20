const ProfileUtils = {
    updateProfileImage: function(imageData) {
        const mainProfileImage = document.getElementById('profileImage');
        if (mainProfileImage) {
            mainProfileImage.src = imageData;
        }

        const navbarProfileImage = document.querySelector('.navbar .dropdown-toggle img');
        if (navbarProfileImage) {
            navbarProfileImage.src = imageData;
        }

        localStorage.setItem('profileImage', imageData);
    },

    loadProfileImage: function() {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            this.updateProfileImage(savedImage);
        }
    },

    handleImageUpload: function(file, userId) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('No file selected');
                return;
            }

            if (!file.type.startsWith('image/')) {
                reject('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                reject('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                this.updateProfileImage(imageData);

                if (userId) {
                    fetch(`http://localhost:3000/users/${userId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            profileImage: imageData
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update profile image');
                        }
                        return response.json();
                    })
                    .then(updatedUser => {
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        resolve('Profile image updated successfully');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        reject('Failed to update profile image. Please try again.');
                    });
                } else {
                    resolve('Profile image updated successfully');
                }
            };
            reader.onerror = () => reject('Error reading file');
            reader.readAsDataURL(file);
        });
    }
};

window.ProfileUtils = ProfileUtils; 