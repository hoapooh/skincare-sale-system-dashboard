import ProductDetail from '@/features/Product/ProductDetail';
import { getProductByIdApi } from '@/services/productApi';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const fetchProductDetail = async () => {
    const products = await getProductByIdApi(id);
    setData(products);
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  return (
    <>
      <ProductDetail data={data} />
    </>
  );
};

export default ProductDetailPage;
