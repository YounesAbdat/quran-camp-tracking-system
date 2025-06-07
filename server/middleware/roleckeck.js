const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

const supervisorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'supervisor')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Supervisor or Admin privileges required.' 
    });
  }
};

const checkGroupAccess = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }

    const groupId = req.params.groupId || req.body.group;
    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    const hasAccess = req.user.assignedGroups.includes(groupId);
    if (!hasAccess) {
      return res.status(403).json({ 
        message: 'Access denied. You can only access your assigned groups.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking group access' });
  }
};

export { adminOnly, supervisorOrAdmin, checkGroupAccess };
