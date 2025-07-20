const downloadURL = "/home/DownloadFile?id="; // Adjust this URL as needed
const uploadURL = "/home/UploadFile"; // Adjust this URL as needed
const uploadURLSignature = "/home/UploadSignature"; // Adjust this URL as needed

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('dataTableBody');
    const fileUploadInput = document.getElementById('fileUploadInput');

    // --- A. DATA FETCHING (Same as before) ---
    fetch('/home/getdata') // Use the correct URL to your controller action
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            tableBody.innerHTML = ''; // Clear the "Loading..." message

            data.forEach(item => {
                const statusClass = item.status.toLowerCase() === 'active' ? 'text-green-600' :
                    item.status.toLowerCase() === 'pending' ? 'text-yellow-500' :
                        item.status.toLowerCase() === 'inactive' ? 'text-red-500' : 'text-gray-400';

                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300';

                // --- MODIFICATION: Added "data-" attributes to buttons ---
                // We add a common class 'upload-btn' and data attributes to know which item and type was clicked.
                row.innerHTML = `
                    <td class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">${item.id}</td>
                    <td class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">${item.fileName}</td>
                    <td class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${statusClass} font-semibold">${item.status}</td>
                    <td class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">${item.date}</td>
                    <td class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button class="upload-btn bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded inline-flex items-center text-xs transition-colors" data-id="${item.id}" data-upload-type="bir">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <span>Upload BIR</span>
                            </button>
                           <button class="download-btn bg-secondary hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded inline-flex items-center text-xs transition-colors" data-id="${item.id}">
                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span>Download BIR</span>
                                </button>
                            <button class="upload-btn bg-brand hover:bg-brand-dark text-white font-semibold py-1 px-3 rounded inline-flex items-center text-xs transition-colors" data-id="${item.id}" data-upload-type="signature">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                <span>Upload (Sig)</span>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-red-500">Failed to load data. Please try again later.</td></tr>`;
        });

    // --- B. EVENT HANDLING FOR UPLOAD ---

    // Listen for clicks on the entire table body
    tableBody.addEventListener('click', function (event) {
        // Find the closest parent button with the 'upload-btn' class
        const uploadButton = event.target.closest('.upload-btn');
        const downloadButton = event.target.closest('.download-btn');

        if (uploadButton) {
            event.preventDefault(); // Prevent default button behavior

            // Get the item ID and upload type from the button's data attributes
            const fileId = uploadButton.dataset.id;
            const uploadType = uploadButton.dataset.uploadType;

            // Pass this context to the file input before opening it
            fileUploadInput.dataset.contextId = fileId;
            fileUploadInput.dataset.contextType = uploadType;

            // Programmatically click the hidden file input to open the dialog
            fileUploadInput.click();
        }
        else if (downloadButton) {
            event.preventDefault();
            const fileId = downloadButton.dataset.id;
            // Construct the URL and redirect to it, which will trigger the download.
            window.location.href = `${downloadURL}${fileId}`;
        }
    });

    // Listen for when a file is selected in the hidden input
    fileUploadInput.addEventListener('change', function (event) {
        if (event.target.files.length > 0) {
            const selectedFile = event.target.files[0];

            // Retrieve the context we stored earlier
            const fileId = event.target.dataset.contextId;
            const uploadType = event.target.dataset.contextType;

            alert(`Uploading "${selectedFile.name}" for Item ID: ${fileId} (Type: ${uploadType})`);

            // --- Here, you would add your file upload logic ---
            // Example:
            // const formData = new FormData();
            // formData.append('file', selectedFile);
            // formData.append('id', fileId);
            // fetch('/YourController/UploadFile', { method: 'POST', body: formData });
            // ---------------------------------------------------

            // Reset the input value. This allows the user to select the same file again if they need to.
            event.target.value = '';
        }
    });
});



function logout() {
    // You can add any other cleanup logic here, such as clearing
    // session storage or making an API call to invalidate a token.
    console.log("User is logging out...");

    // Redirect the user to the login page.
    // Replace '/YourLoginPage' with the actual URL of your login page.
   fetch('/home/logout')
        .then(response => {
            if (response.ok) {
                window.location.href = '/home/index'; // Redirect to login page
            } else {
                console.error('Logout failed:', response.statusText);
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('An error occurred while logging out. Please try again.');
        });
}