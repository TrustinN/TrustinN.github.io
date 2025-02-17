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
import type { articleElem } from "@/components/ContentContainer";
import { Sidebar } from "@/components/Sidebar";

import { ImageContainer } from "@/components/ImageContainer";
import Image from "next/image";
import { MathJax } from "better-react-mathjax";

const base = "/projects/ImageProcessing/Project1/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Exhaustive Search",
    content: (
      <div>
        <h2>Aligning Images with Exhaustive Search</h2>
        <p>
          Using an exhaustive search given a window{" "}
          <MathJax inline={true}>{"\\([-z, z]\\)"}</MathJax>, the algorithm
          loops over the <MathJax inline={true}>{"\\(x\\)"}</MathJax> and{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax> axis to determine a shift{" "}
          <MathJax inline={true}>{"\\((dx, dy)\\)"}</MathJax> such that{" "}
          <MathJax inline={true}>{"\\(dx, dy\\)"}</MathJax> are in{" "}
          <MathJax inline={true}>{"\\([-z, z]\\)"}</MathJax>. The ideal shift is
          chosen by a given metric, two of which I used for the project are sum
          of squared differences and the zero-normalized correlation
          coefficient. The ZNCC metric is useful for varying brightnesses in the
          channels, as the images are first normalized before maximizing their
          dot product. The exhaustive search is effective for small images such
          as the jpg files.
        </p>
        <ImageContainer columns={3}>
          <Image
            src={path.join(mediaBase, "exhaustive_ex/tobolsk.jpg")}
            alt="tobolsk"
            width="300"
            height="300"
          />
          <Image
            src={path.join(mediaBase, "exhaustive_ex/monastery.jpg")}
            alt="monastery"
            width="300"
            height="300"
          />
          <Image
            src={path.join(mediaBase, "exhaustive_ex/cathedral.jpg")}
            alt="cathedral"
            width="300"
            height="300"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Image Pyramid",
    content: (
      <div>
        <h2>Image Pyramid</h2>
        <p>
          For larger images, larger windows will slow down the result. Using an
          image pyramid, we can recursively downsample the image (by a factor of
          2) to a given depth, at each step, aligning the image and returning
          the shift. Propagation upwards will account for the total displacement
          of the image, which we can use to shift the image. This makes the
          process much faster, as at a depth{" "}
          <MathJax inline={true}>{"\\(d\\)"}</MathJax>, determining the ideal
          displacement is fastest, and accounts for
          <MathJax>
            {
              "\\begin{equation*} (\\#\\text{ pixel shifts}) \\cdot 2^{d} \\end{equation*}"
            }
          </MathJax>
          of the displacement. Although faster, this algorithm struggles with
          the borders that are present in some images. This affects the metric
          used, making the result inaccurate, especially on train.tif, lady.tif,
          and emir.tif.
        </p>
        <ImageContainer columns={4}>
          <Image
            src={path.join(mediaBase, "img_pyramid_ex/emir.jpg")}
            alt="emir"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "img_pyramid_ex/monastery.jpg")}
            alt="monastery"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/img_pyramid_ex/train.jpg")}
            alt="train"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/img_pyramid_ex/harvesters.jpg")}
            alt="harvesters"
            width="300"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Edge Detection",
    content: (
      <div>
        <h2>Edge Detection for Alignment</h2>
        <p>
          One improvement is to use the sobel filter to detect edges in the
          image. We can preprocess the image with the filter, feed this into our
          alignment algorithm and obtain a result more resistant to border
          colors. The filter uses the kernel matrix
          <MathJax>
            {
              "\\begin{equation*}\\begin{bmatrix} 1 & 0 & -1 \\\\ 2 & 0 & -2 \\\\ 1 & 0 & -1 \\end{bmatrix} \\end{equation*}"
            }
          </MathJax>
          derived from adjustments to the discrete form of the derivative:{" "}
          <MathJax>
            {
              "\\begin{equation*} f_{x}(x, y) = \\dfrac{f(x + 1, y) - f(x - 1, y)}{2} \\end{equation*}"
            }
          </MathJax>
          The kernel is convolved with the image matrix to produce the{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax>
          component of the gradient. The same is done for the{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax> component, and the
          normalized euclidean distance between both images is used to obtain
          the edges. Here are some examples of using{" "}
          <code>scipy.signal.convolve2d</code> to do the convolution then
          finding the magnitude:
        </p>
        <ImageContainer columns={3}>
          <Image
            src={path.join(mediaBase, "/edges_ex/cathedral.png")}
            alt="cathedral"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/edges_ex/train.png")}
            alt="train"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/edges_ex/onion_church.png")}
            alt="onion_church"
            width="400"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          And here is the result using <code>sk.filters.sobel</code>:
        </p>
        <ImageContainer columns={4}>
          <Image
            src={path.join(mediaBase, "/sobel_ex/emir.jpg")}
            alt="emir"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/sobel_ex/monastery.jpg")}
            alt="monastery"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/sobel_ex/train.jpg")}
            alt="train"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/sobel_ex/harvesters.jpg")}
            alt="harvesters"
            width="300"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Results",
    content: (
      <div>
        <h2>Naive Cropping and Results</h2>
        <p>
          To achieve stronger results, cropping the image by 15% on all sides
          can remove the issue. This is the final improvement of the program and
          here are all results listed:
        </p>
        <ImageContainer columns={3}>
          <Image
            src={path.join(mediaBase, "/border_crop_ex/emir.jpg")}
            alt="emir"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/monastery.jpg")}
            alt="monastery"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/church.jpg")}
            alt="church"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/three_generations.jpg")}
            alt="three_generations"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/melons.jpg")}
            alt="melons"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/onion_church.jpg")}
            alt="onion_church"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/train.jpg")}
            alt="train"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/tobolsk.jpg")}
            alt="tobolsk"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/icon.jpg")}
            alt="icon"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/cathedral.jpg")}
            alt="cathedral"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/self_portrait.jpg")}
            alt="self_portrait"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/harvesters.jpg")}
            alt="harvesters"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/sculpture.jpg")}
            alt="sculpture"
            width="300"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/border_crop_ex/lady.jpg")}
            alt="lady"
            width="300"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1> Project 1: Images of the Russian Empire</h1>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link}>
                  <div className="px-8">{article.content}</div>
                </Article>
              </Section>
            ))}
          </SectionContainer>
          <Sidebar ids={pageContent.map((article) => article.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}
