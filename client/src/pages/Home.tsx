// client/src/pages/Home.tsx
import { useEffect, useState, type FormEvent } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { api } from '../api/api';

interface Product {
  id: number;
  "name": string,
  "description": string,
  "price": string,
  "stock": number,
}

const deleteBtnClass = "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50";

<button className={deleteBtnClass}>
  Delete
</button>


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    id: 0,
    "name": "",
    "description": "",
    "price": "",
    "stock": 0,
  });


  // Fetch todos from backend
  const fetchProducts = async () => {
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload
    try {
      const res = await api.post<Product>("/products", { product });
      setProducts([...products, res.data]);

      toast.success("Saved")
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      // Safe fallback agar server error message na ho
      const message = err.response?.data?.error || "Something went wrong";
      toast.error(message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await api.delete(`/products/${id}`);
      toast.success("User deleted successfully!");
      setProducts((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      // Safe fallback agar server error message na ho
      const message = err.response?.data?.error || "Something went wrong";
      toast.error(message);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };


  return (
    <div className='flex flex-col items-center gap-5 w-[100vw]  w-full'>
      <form onSubmit={handleSubmit} className="w-[320px] mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Add Product</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={product.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">
          Submit
        </button>
      </form>

      {/* render products */}
      <div className="w-[320px] mx-auto mt-10">
        <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="p-2 text-left text-sm font-medium text-gray-700">description</th>
              <th className="p-2 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: Product) => (
              <tr key={product.id}>
                <td className="p-2 whitespace-nowrap text-gray-800">{product.name}</td>
                <td className="p-2 whitespace-nowrap text-gray-800">{product.description}</td>
                <td className="p-2 whitespace-nowrap text-center">
                  <button onClick={() => handleDelete(product.id)} className={deleteBtnClass}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}