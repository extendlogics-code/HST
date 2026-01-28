const express = require('express');
const router = express.Router();
const { 
  getApplicationWindows, 
  createApplicationWindow, 
  getApplicationWindow, 
  updateApplicationWindow, 
  deleteApplicationWindow 
} = require('../controllers/applicationWindowController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getApplicationWindows);
router.post('/', createApplicationWindow);
router.get('/:id', getApplicationWindow);
router.patch('/:id', updateApplicationWindow);
router.delete('/:id', deleteApplicationWindow);

module.exports = router;
