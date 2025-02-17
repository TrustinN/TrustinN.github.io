import path from "path";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import type { articleElem } from "@/components/ContentContainer";
import { twMerge } from "tailwind-merge";

const base = "/projects";
const pageContent: articleElem[] = [
  {
    id: "RRT-Path-Planning",
    content: (
      <div>
        <p>Building an interactive solver for 2D and 3D environments.</p>
      </div>
    ),
    link: path.join(base, "RRT"),
  },
  {
    id: "Spatial Indexing",
    content: (
      <div>
        <p>
          Building a data structure for fast and efficient queries on spatial
          data.
        </p>
      </div>
    ),
    link: path.join(base, "SpatialIndexing"),
  },
  {
    id: "Computer Vision/Image Processing",
    content: (
      <div>
        <p>
          Exploring methods in applying various transformations to images to
          produce mosaics, morphs, and more.
        </p>
      </div>
    ),
    link: path.join(base, "ImageProcessing"),
  },
  {
    id: "Computer Graphics",
    content: (
      <div>
        <p>Exploring textures/rendering/animation.</p>
      </div>
    ),

    link: path.join(base, "ComputerGraphics"),
  },
  {
    id: "Surface Reconstruction",
    content: (
      <div>
        <p>Regenerating meshes from point clouds.</p>
      </div>
    ),
    link: path.join(base, "SurfaceReconstruction"),
  },
];

const thumbnails: Record<string, string> = {
  "RRT-Path-Planning": "bg-[url(/projects/media/navigation.png)]",
  "Computer Vision/Image Processing": "bg-[url(/projects/media/lens.png)]",
  "Computer Graphics": "bg-[url(/projects/media/camera.jpeg)]",
  "Spatial Indexing": "bg-[url(/projects/media/map.png)]",
  "Surface Reconstruction": "bg-[url(/projects/media/mesh.jpeg)]",
};

export default async function Page() {
  return (
    <div>
      <Banner>
        <h1> Projects </h1>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link} className="p-0">
                  <div
                    className={twMerge(
                      `rounded-t-2xl min-h-12 w-full h-16 flex items-center justify-center ${thumbnails[article.id]} bg-cover bg-fixed bg-center bg-no-repeat before:opacity-30 text-opacity-100`,
                    )}
                  >
                    <div className="bg-gray-200 bg-opacity-60 text-opacity-100 w-full h-full flex justify-center items-center rounded-t-2xl">
                      <h2>{article.id}</h2>
                    </div>
                  </div>
                  <div className="px-8">{article.content}</div>
                </Article>
              </Section>
            ))}
          </SectionContainer>
        </MainContainer>
      </PageContainer>
    </div>
  );
}
