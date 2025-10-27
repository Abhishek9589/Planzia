// Shared constants for venue types and areas used across the application

export const LOCALITY_AREAS = [
  'Hinjewadi', 'Wagholi', 'Kharadi', 'Wakad', 'Baner', 'Hadapsar', 'Talegaon Dabhade',
  'Pimple Saudagar', 'Kothrud', 'Undri', 'Viman Nagar', 'Bavdhan', 'Sus', 'Dhanori',
  'Kondhwa', 'Balewadi', 'Sinhagad Road', 'Wadgaon Sheri', 'Moshi', 'Kalyani Nagar',
  'Ravet', 'Kesnand', 'Ambegaon Budruk', 'Aundh', 'Pirangut',
  'Uruli Kanchan', 'Alandi Road', 'Chakan', 'Katraj', 'Rahatani'
];

// Backward compatibility: keep old export name used across the app
export const PUNE_AREAS = LOCALITY_AREAS;

export const VENUE_TYPES = [
  'Auditoriums',
  'Banquet halls',
  'Farmhouses',
  'Hotels & resorts',
  'IT Parks',
  'Lawns/gardens',
  'Lounges & rooftops',
  'Malls',
  'Open grounds',
  'Restaurants & cafes',
  'RWA',
  'Stadiums & arenas'
];

// For filters - includes "All" options
export const FILTER_AREAS = ['All Locations', ...LOCALITY_AREAS];
export const FILTER_VENUE_TYPES = ['All Types', ...VENUE_TYPES];
