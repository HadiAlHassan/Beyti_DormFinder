import ImagePreview from './ImagePreview';

const ImageGrid = () => {
  const imageItems = [
    { src: "/AboutUs1.png", text: "Flexible Leases" },
    { src: "/AboutUs2.png", text: "7-Day Happiness Guaranteed" },
    { src: "/AboutUs3.png", text: "Monthly House Cleaning" },
    { src: "/AboutUs4.png", text: "Choose Your Own Roomate" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-10">
      {imageItems.map((item, index) => (
        <ImagePreview key={index} src={item.src} text={item.text} />
      ))}
    </div>
  );
};

export default ImageGrid;
