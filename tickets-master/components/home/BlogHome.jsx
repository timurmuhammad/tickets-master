import Image from "next/image";
import { Link } from "@/navigation";
import blogsData from "../../data/blogs";

const BlogHome = () => {
  return (
    <>
      {blogsData.slice(0, 3).reverse().map((item) => (
        <div
          className="col-lg-4 col-sm-6"
          key={item.id}
          data-aos="fade"
          data-aos-delay={item.delayAnimation}
        >
          <Link
            href={`https://blog.ttm.org/${item.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="blogCard -type-1 d-block "
          >
            <div className="blogCard__image">
              <div className="ratio ratio-4:3 rounded-22">
                <Image
                  width={400}
                  height={300}
                  className="img-ratio js-lazy"
                  src={item.img}
                  alt="image"
                />
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-dark-1 text-18 fw-500">{item.title}</h4>
              <div className="text-light-1 text-15 lh-14 mt-5">{item.date}</div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default BlogHome;
