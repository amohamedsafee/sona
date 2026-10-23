const db = require('../config/db');
const dashboardQueries = require('../queries/dashboard.queries');
const logQueries = require('../queries/logs.queries');

exports.getDashboardData = async (req, res) => {
  try {
    const [kpiRows, statusCounts, monthlyRevenue, occupancyRows, latestBookings, latestInquiries, recentLogs] = await Promise.all([
      db.query(dashboardQueries.GET_KPI_SUMMARY),
      db.query(dashboardQueries.GET_BOOKING_STATUS_COUNTS),
      db.query(dashboardQueries.GET_MONTHLY_REVENUE),
      db.query(dashboardQueries.GET_OCCUPANCY_STATS),
      db.query(dashboardQueries.GET_LATEST_BOOKINGS, [6]),
      db.query(dashboardQueries.GET_LATEST_INQUIRIES),
      db.query(logQueries.GET_RECENT, [8])
    ]);

    const kpi = kpiRows[0] || {};
    const occupancy = occupancyRows[0] || {};

    res.json({
      success: true,
      data: {
        kpi: {
          totalBookings: parseInt(kpi.total_bookings, 10) || 0,
          totalRevenue: parseFloat(kpi.total_revenue) || 0,
          pendingBookings: parseInt(kpi.pending_bookings, 10) || 0,
          occupiedRooms: parseInt(kpi.currently_occupied_rooms, 10) || 0,
          availableRooms: parseInt(kpi.available_rooms, 10) || 0,
          totalRooms: parseInt(kpi.total_rooms, 10) || 0,
          unreadInquiries: parseInt(kpi.unread_inquiries, 10) || 0,
          occupancyPercentage: parseFloat(occupancy.occupancy_percentage) || 0
        },
        statusCounts,
        monthlyRevenue,
        latestBookings,
        latestInquiries,
        recentLogs
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard metrics.', error: err.message });
  }
};
