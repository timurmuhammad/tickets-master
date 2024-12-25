import { Link } from "@/navigation";

const Tags = () => {
  const tagsData = [
    { id: 1, href: "/", tag: "Top" },
    { id: 2, href: "/", tag: "Cheap" },
    { id: 3, href: "/", tag: "Baggage" },
    { id: 4, href: "/", tag: "Transfer" },
    { id: 5, href: "/", tag: "Airline" },
  ];
  return (
    <>
      {tagsData.slice(0, 7).map((item) => (
        <div key={item.id} className="col-auto">
          <Link
            href={`/${item.href}`}
            className="button -blue-1 py-5 px-20 bg-blue-1-05 rounded-100 text-12 text-dark-1 uppercase"
          >
            {item.tag}
          </Link>
        </div>
      ))}
    </>
  );
};

export default Tags;
