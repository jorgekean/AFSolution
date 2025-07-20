document.addEventListener('DOMContentLoaded', function () {
    // --- STATE & CONFIG ---
    let allData = [];
    let currentPage = 1;
    const pageSize = 10;
    const apiEndpoints = {
        getData: '/home/getdata',
        downloadFile: '/home/downloadfile',
        uploadFile: '/home/uploadfile',
        uploadSignature: '/home/uploadsignature',
        logout: '/home/logout'
    };

    // --- DOM ELEMENTS ---
    const tableBody = document.getElementById('dataTableBody');
    const paginationContainer = document.getElementById('pagination-container');
    const fileUploadInput = document.getElementById('fileUploadInput');
    const toastContainer = document.getElementById('toast-container');

    // --- UI HELPERS ---

    /**
     * Displays a toast notification.
     * @param {string} message The message to display.
     * @param {string} type 'success', 'error', or 'info'.
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };
        toast.className = `text-white text-sm py-2 px-4 rounded-lg shadow-lg animate-fadeIn ${colors[type]}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('animate-fadeIn');
            toast.classList.add('animate-fadeOut');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }

    // --- RENDERING FUNCTIONS ---

    function renderPage(page) {
        currentPage = page;
        tableBody.innerHTML = '';

        if (allData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-gray-500">No data found.</td></tr>`;
            renderPaginationControls();
            return;
        }

        const pageData = allData.slice((page - 1) * pageSize, page * pageSize);

        pageData.forEach(item => {
            const statusClass = item.status.toLowerCase() === 'active' ? 'text-green-600' : item.status.toLowerCase() === 'pending' ? 'text-yellow-500' : 'text-red-500';
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300';
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
                </td>`;
            tableBody.appendChild(row);
        });
        renderPaginationControls();
    }

    function renderPaginationControls() {
        const totalPages = Math.ceil(allData.length / pageSize);
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const pageInfo = document.createElement('span');
        pageInfo.className = 'text-gray-600 dark:text-gray-400';
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'flex items-center gap-1';

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&laquo; Previous';
        prevButton.className = 'px-3 py-1 rounded bg-white dark:bg-gray-700 hover:bg-brand-light hover:text-white disabled:opacity-50 disabled:cursor-not-allowed';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => renderPage(currentPage - 1));

        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'Next &raquo;';
        nextButton.className = 'px-3 py-1 rounded bg-white dark:bg-gray-700 hover:bg-brand-light hover:text-white disabled:opacity-50 disabled:cursor-not-allowed';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => renderPage(currentPage + 1));

        buttonsContainer.appendChild(prevButton);
        buttonsContainer.appendChild(nextButton);

        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(buttonsContainer);
    }

    // --- DATA FETCHING & INITIALIZATION ---
    fetch(apiEndpoints.getData)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            allData = data;
            renderPage(1);
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-8 text-red-500">Failed to load data. Please try again.</td></tr>`;
        });

    // --- EVENT LISTENERS ---
    tableBody.addEventListener('click', function (event) {
        const uploadButton = event.target.closest('.upload-btn');
        const downloadButton = event.target.closest('.download-btn');

        if (uploadButton) {
            event.preventDefault();
            fileUploadInput.dataset.contextId = uploadButton.dataset.id;
            fileUploadInput.dataset.contextType = uploadButton.dataset.uploadType;
            fileUploadInput.click();
        } else if (downloadButton) {
            event.preventDefault();
            window.location.href = `${apiEndpoints.downloadFile}?id=${downloadButton.dataset.id}`;
        }
    });

    fileUploadInput.addEventListener('change', function (event) {
        if (event.target.files.length === 0) return;

        const selectedFile = event.target.files[0];
        const fileId = event.target.dataset.contextId;
        const uploadType = event.target.dataset.contextType;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('id', fileId);

        const targetUrl = uploadType === 'signature' ? apiEndpoints.uploadSignature : apiEndpoints.uploadFile;

        showToast(`Uploading "${selectedFile.name}"...`, 'info');

        fetch(targetUrl, { method: 'POST', body: formData })
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(data => {
                showToast(data.message || 'Upload successful!', 'success');
                // Optionally, refresh data to show status changes
                // fetch(apiEndpoints.getData).then(...); 
            })
            .catch(error => {
                console.error('Upload failed:', error);
                showToast('Upload failed. Please try again.', 'error');
            });

        event.target.value = ''; // Reset input
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