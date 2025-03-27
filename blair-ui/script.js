document.addEventListener('DOMContentLoaded', () => {
  // ----- Calibration Drop Zone (Step 1) -----
  const calibrationDropZone = document.getElementById('calibrationDropZone');
  const calibrationFileInput = document.getElementById('calibrationFileInput');
  const calibrationCanvas = document.getElementById('calibrationCanvas');
  const calibrationCtx = calibrationCanvas.getContext('2d');

  // Open file dialog when clicking on the drop zone
  calibrationDropZone.addEventListener('click', () => calibrationFileInput.click());

  // Handle file selection
  calibrationFileInput.addEventListener('change', () => {
    const file = calibrationFileInput.files[0];
    if (file) {
      console.log('Calibration file selected:', file.name);
      const fileURL = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = fileURL;
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.load();

      video.addEventListener('loadeddata', () => {
        console.log('Calibration video data loaded; setting currentTime');
        // Set a slight offset to ensure a valid frame is ready
        video.currentTime = 0.1;
      });

      video.addEventListener('seeked', () => {
        console.log('Calibration video seeked; drawing frame');
        calibrationCtx.drawImage(video, 0, 0, calibrationCanvas.width, calibrationCanvas.height);
        URL.revokeObjectURL(fileURL); // Cleanup the object URL

        // Hide the drop zone and its border after successful upload
        calibrationDropZone.style.display = 'none';

        // Update heading states:
        // Mark "Upload calibration video" as completed (green)
        const uploadHeading = document.getElementById('uploadVideoHeading');
        if (uploadHeading) {
          uploadHeading.classList.add('completed');
        }
        // Mark "Select calibration points" as active (green)
        const selectHeading = document.getElementById('selectPointsHeading');
        if (selectHeading) {
          selectHeading.classList.add('active');
        }
      });
    }
  });

  // Drag-and-drop events for the calibration drop zone
  calibrationDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    calibrationDropZone.classList.add('dragover');
  });
  calibrationDropZone.addEventListener('dragleave', () => {
    calibrationDropZone.classList.remove('dragover');
  });
  calibrationDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    calibrationDropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      calibrationFileInput.files = e.dataTransfer.files;
      calibrationFileInput.dispatchEvent(new Event('change'));
    }
  });
});

video.addEventListener('seeked', () => {
  console.log('Calibration video seeked; drawing frame');
  calibrationCtx.drawImage(video, 0, 0, calibrationCanvas.width, calibrationCanvas.height);
  URL.revokeObjectURL(fileURL); // Cleanup the object URL

  // Update heading states:
  // Mark "Upload calibration video" as completed and remove its highlight
  const uploadHeading = document.getElementById('uploadVideoHeading');
  if (uploadHeading) {
    uploadHeading.classList.remove('highlighted');
    uploadHeading.classList.add('completed'); // optional: mark as done
  }
  // Mark "Select calibration points" as active by adding the highlight
  const selectHeading = document.getElementById('selectPointsHeading');
  if (selectHeading) {
    selectHeading.classList.add('highlighted');
    selectHeading.classList.add('active'); // optional: if you want an extra state
  }
});