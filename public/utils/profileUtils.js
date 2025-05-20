// Profile image handling utilities
const ProfileUtils = {
    // Update profile image in all locations
    updateProfileImage: function(imageData) {
        // Update main profile image if exists
        const mainProfileImage = document.getElementById('profileImage');
        if (mainProfileImage) {
            mainProfileImage.src = imageData;
        }

        // Update navbar profile image if exists
        const navbarProfileImage = document.querySelector('.navbar .dropdown-toggle img');
        if (navbarProfileImage) {
            navbarProfileImage.src = imageData;
        }

        // Save to localStorage
        localStorage.setItem('profileImage', imageData);
    },

    // Load saved profile image
    loadProfileImage: function() {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            this.updateProfileImage(savedImage);
        }
    },

    // Handle profile image upload
    handleImageUpload: function(file, userId) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('No file selected');
                return;
            }

            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                reject('Please select an image file');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                reject('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                this.updateProfileImage(imageData);

                // Update user profile in backend
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

// Export the utilities
window.ProfileUtils = ProfileUtils; 