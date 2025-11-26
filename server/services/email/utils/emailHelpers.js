/**
 * Format dates with times from dates_timings array
 * @param {Array} datesTimings - Array of date/time objects
 * @returns {Object} Object containing formatted schedule and number of days
 */
export function formatScheduleWithTimes(datesTimings) {
  if (!datesTimings || !Array.isArray(datesTimings) || datesTimings.length === 0) {
    return {
      numberOfDays: 0,
      scheduleHTML: '<p style="color: #666;">No dates specified</p>',
      schedulePlainText: 'No dates specified'
    };
  }

  const numberOfDays = datesTimings.length;
  
  let scheduleHTML = '';
  let schedulePlainText = '';

  datesTimings.forEach((item, index) => {
    const date = new Date(item.date);
    const dateStr = date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    // Format time from timing object
    let timeRange = 'Full Day';
    if (item.timing) {
      const { timeFromHour, timeFromMinute, timeFromPeriod, timeToHour, timeToMinute, timeToPeriod } = item.timing;
      if (timeFromHour && timeFromMinute && timeToHour && timeToMinute) {
        timeRange = `${timeFromHour}:${timeFromMinute} ${timeFromPeriod} - ${timeToHour}:${timeToMinute} ${timeToPeriod}`;
      }
    }

    // Alternative: use datetime_from and datetime_to if available
    if (item.datetime_from && item.datetime_to) {
      const fromDate = new Date(item.datetime_from);
      const toDate = new Date(item.datetime_to);
      const fromTime = fromDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      const toTime = toDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      timeRange = `${fromTime} - ${toTime}`;
    }

    const dayText = `Day ${index + 1}: ${dateStr} • ${timeRange}`;
    scheduleHTML += `<p style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 13px; font-weight: 400;">${dayText}</p>`;
    schedulePlainText += (index > 0 ? '\n' : '') + dayText;
  });

  return {
    numberOfDays,
    scheduleHTML,
    schedulePlainText
  };
}

/**
 * Calculate price breakdown
 * @param {Number} pricePerDay - Venue price per day
 * @param {Number} numberOfDays - Number of days
 * @returns {Object} Price breakdown object
 */
export function calculatePriceBreakdown(pricePerDay, numberOfDays) {
  const PLATFORM_FEE_RATE = 0.10;
  const GST_RATE = 0.18;

  const venueAmount = pricePerDay * numberOfDays;
  const platformFee = venueAmount * PLATFORM_FEE_RATE;
  const gstAmount = (venueAmount + platformFee) * GST_RATE;
  const totalAmount = venueAmount + platformFee + gstAmount;

  return {
    venueAmount: Math.round(venueAmount),
    platformFee: Math.round(platformFee),
    gstAmount: Math.round(gstAmount),
    totalAmount: Math.round(totalAmount),
    numberOfDays
  };
}

/**
 * Generate HTML for price breakdown table
 * @param {Object} priceBreakdown - Price breakdown object from calculatePriceBreakdown
 * @returns {string} HTML for price breakdown table
 */
export function generatePriceBreakupHTML(priceBreakdown) {
  const { numberOfDays, venueAmount, platformFee, gstAmount, totalAmount } = priceBreakdown;

  return `
    <div style="margin: 20px 0; background-color: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 20px;">
      <p style="color: #424a52; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase;">Price Breakdown</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 12px 0;">
        <tr>
          <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 400; border-bottom: 1px solid #e2e8f0;">
            Venue Amount (${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'})
          </td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-size: 13px; font-weight: 500; border-bottom: 1px solid #e2e8f0;">
            ₹${venueAmount.toLocaleString('en-IN')}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 400; border-bottom: 1px solid #e2e8f0;">
            Platform Fee (10%)
          </td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-size: 13px; font-weight: 500; border-bottom: 1px solid #e2e8f0;">
            ₹${platformFee.toLocaleString('en-IN')}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #4a5568; font-size: 13px; font-weight: 400; border-bottom: 1px solid #e2e8f0;">
            GST (18%)
          </td>
          <td style="padding: 8px 0; text-align: right; color: #1a1a1a; font-size: 13px; font-weight: 500; border-bottom: 1px solid #e2e8f0;">
            ₹${gstAmount.toLocaleString('en-IN')}
          </td>
        </tr>
        <tr style="background-color: #e6f3ff;">
          <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; border-radius: 0 0 0 6px;">
            Total Amount
          </td>
          <td style="padding: 12px 0; text-align: right; color: #1a1a1a; font-size: 14px; font-weight: 700; border-radius: 0 0 6px 0;">
            ₹${totalAmount.toLocaleString('en-IN')}
          </td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Generate plain text price breakdown for text emails
 * @param {Object} priceBreakdown - Price breakdown object from calculatePriceBreakdown
 * @returns {string} Plain text price breakdown
 */
export function generatePriceBreakupText(priceBreakdown) {
  const { numberOfDays, venueAmount, platformFee, gstAmount, totalAmount } = priceBreakdown;

  return `
PRICE BREAKDOWN:
Venue Amount (${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'}): ₹${venueAmount.toLocaleString('en-IN')}
Platform Fee (10%): ₹${platformFee.toLocaleString('en-IN')}
GST (18%): ₹${gstAmount.toLocaleString('en-IN')}
─────────────────────────────────
Total Amount: ₹${totalAmount.toLocaleString('en-IN')}
  `.trim();
}
