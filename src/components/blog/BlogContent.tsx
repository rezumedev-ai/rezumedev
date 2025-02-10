
interface BlogContentProps {
  content: string;
  image: string;
}

export const BlogContent = ({ content, image }: BlogContentProps) => {
  return (
    <>
      <div className="prose-img mb-12">
        <img 
          src={image}
          alt="Blog post featured image" 
          className="w-full h-[400px] object-cover rounded-lg shadow-md animate-fade-in"
        />
      </div>
      <div 
        className="prose prose-lg max-w-none animate-fade-up space-y-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};
