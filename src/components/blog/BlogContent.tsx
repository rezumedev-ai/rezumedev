
interface BlogContentProps {
  content: string;
  image: string;
}

export const BlogContent = ({ content, image }: BlogContentProps) => {
  return (
    <>
      <div className="prose-img mb-8 md:mb-12">
        <img 
          src={image}
          alt="Blog post featured image" 
          className="w-full h-[250px] md:h-[400px] object-cover rounded-lg shadow-md animate-fade-in"
          loading="lazy"
        />
      </div>
      <div 
        className="prose prose-sm md:prose-lg max-w-none animate-fade-up space-y-4 md:space-y-6
          prose-headings:font-semibold 
          prose-p:text-gray-600 
          prose-a:text-primary hover:prose-a:text-primary/80
          prose-strong:text-gray-900
          prose-ul:space-y-2
          prose-li:text-gray-600"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};
