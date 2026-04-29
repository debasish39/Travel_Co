function PackageCard({ title, price }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-xl">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-green-600 font-bold">₹{price}</p>
      <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Enquire Now
      </button>
    </div>
  );
}
export default PackageCard;