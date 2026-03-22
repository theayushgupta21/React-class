import { useEffect, useState } from "react";


function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);



  const fetchProducts = async () => {
    const res = await fetch("https://dummyjson.com/products?limit=120&skip=10&select=title,price,thumbnail");
    const data = await res.json();
    console.log(data);

    if (data && data.products) {
      setProducts(data.products);
      setTotalPages(data.total / 10)

    }

  };
  console.log(products);
  useEffect(() => {
    fetchProducts();
  }, []);
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= products.length / 10 &&
      selectedPage !== page)
      setPage(selectedPage)
  }

  return (
    <>
      <div>
        {products.length > 0 && (
          <div className="products">
            {products.slice(page * 10 - 10, page * 10).map((prod) => {
              return (
                <span className="products__single" key={prod.id}>
                  <img src={prod.thumbnail} alt={prod.title} />
                  <p>{prod.title}</p>
                </span>
              );
            })}
          </div>
        )}
        {
          products.length > 0 && <div className="pagination">
            <span
              className={page > 1 ? "" : "pagination__disable"}
              onClick={() => selectPageHandler(page - 1)} >👈</span>
            {[...Array(products.length / 10)].map((_, i) => {
              return (
                <span
                  className={page === i + 1 ? "pagination__selected" : ""}
                  onClick={() => selectPageHandler(i + 1)} key={i}>{i + 1}</span>
              );
            })
            }

            <span onClick={() => selectPageHandler(page + 1)}
              className={page < products.length / 10 ? "" : "pagination__disable"}
            >👉</span>
          </div>

        }
        <div>

        </div>


      </div>

    </>
  )
}

export default App
