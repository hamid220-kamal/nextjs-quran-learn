// Using local data files from the public directory
const API_BASE_URL = '/data/duas';

const fetchOptions: RequestInit = {
  cache: 'force-cache',
  headers: {
    'Accept': 'application/json'
  }
};

// Static languages since we're not implementing language switching yet
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

export async function fetchLanguages() {
  return SUPPORTED_LANGUAGES;
}

export async function fetchCategories(_language: string = 'en') {
  try {
    const res = await fetch(`${API_BASE_URL}/categories.json`, {
      ...fetchOptions,
      method: 'GET'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Let the component handle the error
  }
}

export async function fetchDuasByCategory(slug: string, _language: string = 'en') {
  try {
    const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(slug)}.json`, {
      ...fetchOptions,
      method: 'GET'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch duas for category ${slug}: ${res.status}`);
    }

    const data = await res.json();
    return data.duas || [];
  } catch (error) {
    console.error(`Error fetching duas for category ${slug}:`, error);
    throw error; // Let the component handle the error
  }
}

export async function fetchDuaDetails(slug: string, id: string, _language: string = 'en') {
  try {
    // First fetch all duas for the category
    const duas = await fetchDuasByCategory(slug);
    // Then find the specific dua
    const dua = duas.find(d => d.id === id);
    return dua || null;
  } catch (error) {
    console.error(`Error fetching dua details for ${slug}/${id}:`, error);
    throw error; // Let the component handle the error
  }
}