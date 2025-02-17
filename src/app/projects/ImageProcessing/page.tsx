"use client";

import path from "path";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import { MathJax } from "better-react-mathjax";

import type { articleElem } from "@/components/ContentContainer";

const base = "/projects/ImageProcessing/";

const pageContent: articleElem[] = [
  {
    id: "project1",
    content: (
      <div>
        <h2>Project 1: Images of the Russian Empire</h2>
        <p>
          The project focused on methods of aligning images and understanding
          techniques that are fundamental to image processing such as
          application of gaussian and lapalcian stacks and image pyramids.
        </p>
        <p>
          Image alignment is an important topic in computer vision, and arises
          in many problems such as image transformation, stitching, and
          registration.
        </p>
      </div>
    ),
    link: path.join(base, "Project1"),
  },
  {
    id: "project2",
    content: (
      <div>
        <h2>Project 2: Fun With Filters and Frequencies</h2>
        <p>
          Filters are effective tools for edge detection and separating
          frequencies. They are powerful because they line up closely with how
          people process visual data. In convoluting a filter with an image, we
          are essentially finding points in the image where the filter matches
          the image, a form of template matching. Our brains essentially does
          the same process, and contains neurons dedicated to detecting certain
          features in an image, such as an oriented edge/pattern.
        </p>
        <p>
          In this project, I explore using filters to separate frequencies
          between images to do cool things such as blending.
        </p>
      </div>
    ),
    link: path.join(base, "Project2"),
  },
  {
    id: "project3",
    content: (
      <div>
        <h2>Project 3: Face Morphing and Modeling a Photo Collection</h2>
        <p>
          Filters act on the pixels of an image, but we can also consider
          transformations on the positions of these pixels. If we think of
          images as a function from{" "}
          <MathJax inline={true}>
            {"\\(I: \\mathbb{R}^{2} \\rightarrow \\mathbb{R}\\)"}
          </MathJax>
          , where the position of a pixel is mapped to a value, there there is a
          class of transformations <MathJax inline={true}>{"\\(T\\)"}</MathJax>{" "}
          that augment the pixel locations.
          <MathJax>{"\\begin{equation*} I(T(x)) = y \\end{equation*}"}</MathJax>
          This project explores these transformations, specifically affine
          transformations, and their use in mapping triangles to triangles for
          face morphing.
        </p>
      </div>
    ),
    link: path.join(base, "Project3"),
  },
  {
    id: "project4",
    content: (
      <div>
        <h2>Project 4: Image Warping and Mosaicing</h2>
        <p>
          The previous project looks at a euclidean mapping (rotation followed
          by displacement), but if we want to account for shifts in perspective,
          this is not enough. This is where homographies come in, which allows
          us to map quadrilaterals to quadrilaterals.
        </p>
        <p>
          With this, we can create panoramas by taking multiple pictures,
          processing with a perspective warp, and stitching them together. This
          project also explores automatic image alignment to make the stitching
          process easier.
        </p>
      </div>
    ),
    link: path.join(base, "Project4"),
  },
  {
    id: "project5",
    content: (
      <div>
        <h2>Project 5: Fun With Diffusion Models!</h2>
        <p>
          Many image processing techniques for removing noise are not effective.
          We can use linear/nonlinear filters to get different results depending
          on the input image, but these are not flexible when dealing with a lot
          of noise.
        </p>
        <p>
          Training a denoiser helps us with this complex task of denoising and
          also offers an interesting way to generate new images. We can start
          with pure noise and iteratively denoise this to obtain a clean image
          that looks realistic. Combined with several other techniques, we can
          obtain a wide range of images.
        </p>
      </div>
    ),
    link: path.join(base, "Project5"),
  },
  {
    id: "project6",
    content: (
      <div>
        <h2>Project 6: Poor Man&apos;s Augmented Reality</h2>
        <p>
          By establishing the correspondences between points in the image with
          those in 3D space, we can map arbitrary points from 3D space into the
          image.
        </p>
      </div>
    ),
    link: path.join(base, "Project6"),
  },
  {
    id: "project7",
    content: (
      <div>
        <h2>Project 7: Tour into the Picture</h2>
        <p>Using homographies, we and reconstruct the 3d scene of the image.</p>
      </div>
    ),
    link: path.join(base, "Project7"),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Image Processing/Computer Vision</h1>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link}>
                  {article.content}
                </Article>
              </Section>
            ))}
          </SectionContainer>
        </MainContainer>
      </PageContainer>
    </div>
  );
}
