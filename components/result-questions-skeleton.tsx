export default function ResultQuestionsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-4">
      {/* Result count skeleton */}
      <div className="mb-6 text-center">
        <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto mt-2 animate-pulse"></div>
      </div>

      {/* Questions grid skeleton */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        {Array.from({ length: 24 }).map((_, index : number) => (
          <QuestionCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-8 flex justify-center gap-2">
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </section>
  );
}

function QuestionCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
      
      {/* Question skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>
      
      {/* Answer skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse"></div>
      </div>
    </div>
  );
}