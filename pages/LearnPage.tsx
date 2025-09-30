
import React, { useContext } from 'react';
import Header from '../components/layout/Header';
import { ProgramContext } from '../App'; // To apply theme to header
import { useEducationalResources } from '../hooks/useEducationalResources';

const LearnPage: React.FC = () => {
  const programContext = useContext(ProgramContext);
  const pageThemeClass = programContext?.activeProgram?.themeClass || 'theme-weight';
  const { resources, loading, error } = useEducationalResources();

  const renderContentPreview = (content: string | undefined): string => {
    if (!content) {
      return 'Tap to learn more about this topic.';
    }

    const normalized = content.replace(/\s+/g, ' ').trim();
    if (normalized.length <= 160) {
      return normalized;
    }

    return `${normalized.slice(0, 157)}...`;
  };

  return (
    <div className="flex flex-col flex-grow">
      <Header title="Learn" subtitle="Expand your knowledge" />
      <main className={`px-6 pt-5 pb-36 flex-grow ${pageThemeClass}`} role="main">
        <div className="text-center py-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Center</h2>
          <p className="text-lg text-gray-600 mb-8">
            Discover articles, guides, and resources to help you on your health journey.
          </p>
          {error && (
            <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {loading && resources.length === 0 ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="h-[340px] animate-pulse rounded-2xl bg-white/60" />
              ))
            ) : resources.length > 0 ? (
              resources.map((resource, index) => {
                const imageUrl =
                  (resource as Record<string, unknown>).thumbnail_url && typeof (resource as Record<string, unknown>).thumbnail_url === 'string'
                    ? (resource as Record<string, unknown>).thumbnail_url as string
                    : (resource as Record<string, unknown>).image_url && typeof (resource as Record<string, unknown>).image_url === 'string'
                      ? (resource as Record<string, unknown>).image_url as string
                      : `https://picsum.photos/seed/learn-${resource.id || index}/400/200`;

                const readTime = resource.read_time ? `${resource.read_time} min read` : null;

                return (
                  <article key={resource.id ?? index} className="program-card p-6 text-left">
                    <img
                      src={imageUrl}
                      alt={resource.title}
                      className="mb-4 aspect-video w-full rounded-lg object-cover"
                    />
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{resource.title}</h3>
                    {resource.category && (
                      <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {resource.category}
                      </span>
                    )}
                    <p className="mb-4 text-sm text-gray-600">
                      {renderContentPreview(resource.content as string | undefined)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {readTime && <span>{readTime}</span>}
                      <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-gray-200 p-6 text-sm text-gray-600">
                <p className="font-medium text-gray-700">Educational resources are on the way</p>
                <p className="mt-1">We&apos;re preparing new content to support your program. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
