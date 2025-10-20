// Test script for admin functionality

// Test data for a new product
const testProduct = {
    name: "Test Luxury Watch",
    description: "A beautiful luxury watch with premium features",
    price: 299.99,
    category: "rolex",
    image: "https://placehold.co/600x400/1a1a1a/ffffff?text=Test+Watch"
};

// Test adding a product
async function testAddProduct() {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin123'
            },
            body: JSON.stringify(testProduct)
        });

        const result = await response.json();
        console.log('Add product result:', result);
        return result;
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Test getting products
async function testGetProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();
        console.log('Products:', products);
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
    }
}

// Run tests
async function runTests() {
    console.log('Testing admin functionality...');

    // Add a product
    console.log('Adding test product...');
    const newProduct = await testAddProduct();

    // Get all products
    console.log('Getting all products...');
    const products = await testGetProducts();

    console.log('Test completed.');
}

// Run the tests
runTests();