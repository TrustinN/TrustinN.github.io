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

const base = "/projects/ImageProcessing/Project2/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Edge Detection",
    content: (
      <div>
        <h2>Filters for Edge Detection</h2>
        <p>
          Detecting edges is detecting areas where the pixel values change
          abruptly, corresponding to the magnitude of the gradient at that
          pixel. The filter uses the kernel matrix
          <MathJax>
            {
              "\\begin{equation*} \\begin{bmatrix} -1 & 1 \\end{bmatrix} \\end{equation*}"
            }
          </MathJax>
          and
          <MathJax>
            {
              "\\begin{equation*} \\begin{bmatrix} -1 \\\\ 1 \\end{bmatrix}\\end{equation*}"
            }
          </MathJax>
          derived from the derivative:
          <MathJax>
            {
              "\\begin{equation*}f_x(x, y) = f(x + 0.5, y) - f(x - 0.5, y) \\end{equation*}"
            }
          </MathJax>
          These kernels are convolved with the image to get the{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax>
          and <MathJax inline={true}>{"\\(y\\)"}</MathJax>
          components of the gradient. We then take the euclidean norm between
          the <MathJax inline={true}>{"\\(x\\)"}</MathJax> and{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax> components to get the
          magnitude. To obtain an output in terms of either zeros or ones, I
          used a threshold as a cutoff value to determine if the pixel was part
          of an edge or not. To do this, I normalized the gradient magnitude
          image and compared to the threshold with
          <MathJax>
            {
              "\\begin{equation*} \\lvert\\text{img}[i][j] \\rvert < 3 \\cdot \\text{threshold}\\end{equation*}"
            }
          </MathJax>
          I found that normalization was important for filters that might scale
          up the pixel values.
        </p>
        <p>
          To improve the edge detection, I used a gaussian blur which can be
          convolved with both the finite difference{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax> and{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax> filters to get the
          difference of gaussian filter. This is useful because it removes the
          high frequencies/details that might accidently be detected as edges.
          One difference between the filters is how convolving with a gaussian
          first makes the edges less sharp. Then the gradient&apos;s magnitude
          is less, and I had to adjust the threshold to be lower. In the
          previous filter, I used a threshold of{" "}
          <MathJax inline={true}>{"\\(0.8\\)"}</MathJax>, where all values above{" "}
          <MathJax inline={true}>{"\\(3 * 0.8\\)"}</MathJax> were set to{" "}
          <MathJax inline={true}>{"\\(1\\)"}</MathJax>. In this one, I adjusted
          the threshold to <MathJax inline={true}>{"\\(0.5\\)"}</MathJax>.
        </p>
        <p>
          Below on the left is the output using the finite difference filters
          and one the right is with the difference of gaussian filters. We can
          see that there is a difference in the bottom of the images. The finite
          difference filter picks up the high frequencies and details that come
          from the grass, which blurring the image with a gaussian suppresses
          these frequencies. So in the difference of gaussian image, the high
          frequencies of the grass are not captured. Another visible difference
          is the edge width captured. Since we are blurring the images, it would
          make sense that locally around an edge, the pixels would pick up a
          similar gradient as their neighbors.
        </p>
        <p>
          The same result is achieved whether applying a gaussian blur to the
          image then finite difference filter or convolving the fd filter with a
          gaussian filter to obtain first, then applying the image. This is
          because convolution is associative.
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "finiteDiffCameraman.png")}
            alt="fdCameraman"
            width="400"
            height="300"
          />
          <Image
            src={path.join(mediaBase, "/DOGCameraman.png")}
            alt="DOGCameraman"
            width="400"
            height="300"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Unsharp Filter",
    content: (
      <div>
        <h2>Image Sharpening</h2>
        <p>
          To sharpen an image, I convoluted a gaussian filter with the image and
          subtracted the result from the original image to get the high
          frequencies. Then the high frequences are multiplied by some scalar
          value and added back to the original to get more detail. On the left
          is the original, and the right is the sharpened image:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/taj copy.jpg")}
            alt="taj_original"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/taj.png")}
            alt="taj"
            width="400"
            height="300"
            loading="lazy"
          />

          <Image
            src={path.join(mediaBase, "/woods copy.png")}
            alt="woods_original"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/woods.png")}
            alt="woods"
            width="400"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Hybrid Images",
    content: (
      <div>
        <h2>Hybrid Images</h2>
        <p>
          To get a hybrid image, I convoluted one with a gaussian filter and the
          other with the identity filter minus the gaussian filter (Laplacian
          filter). The two images are added together to get a hybrid image. As
          for choosing the threshold, I found that having a higher standard
          deviation for the Laplacian filter was more effective in bringing out
          the details of the high frequency picture.
        </p>
        <p>
          In the frequency image, the cat image has a strong star shaped
          frequency because of the rotated image. The sharp edges in the image
          contribute to the amplitude. The same can be said about the derek
          picture because of the band at the top. Taking the hybrid image
          results in a frequency domain image that looks like an average of the
          previous two.
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/derek_nutmeg.png")}
            alt="hybrid"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/fourier.png")}
            alt="fourier"
            width="400"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          One failed example is a blending between a panda and bear. One problem
          that can make the hybrid less convincing is if the edges do not line
          up well:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/panda_bear.png")}
            alt="panda_bear"
            width="400"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          Here is a more successful hybrid which is between a tennis ball and
          orange. This works well because the edges line up well:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/hairy_orange.png")}
            alt="hairy_orange"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/tennis.png")}
            alt="tennis"
            width="400"
            height="400"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Gaussian and Lapacian Stacks",
    content: (
      <div>
        <h2>Gaussian and Laplacian Stacks</h2>
        <p>
          The gaussian stack is obtained by repeating the gaussian convolution
          with the previous image and doubling the standard deviation of the
          gaussian at each level. I chose a standard deviation of 1 for the
          first level after the original image and a kernel size of{" "}
          <MathJax inline={true}>{"\\(6 \\cdot \\sigma\\) "}</MathJax>
          to ensure that values outside the kernel would be close to{" "}
          <MathJax inline={true}>{"0"}</MathJax>. As for the Laplacian stack,
          this is obtained by taking the pairwise difference of the an image in
          the Gaussian stack and the next image. This gives an image that
          captures a certain band of frequencies at each level. For both the
          Laplacian and Gaussian stacks, the last image contains a collection of
          the lowest frequencies of the image.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/spline/stack.png")}
            alt="stack"
            width="400"
            height="300"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Multi-Resolution Blending",
    content: (
      <div>
        <h2>Multi-Resolution Blending</h2>
        <p>
          To get a seemless blend of two images, both images are alpha blended
          at each level given by their Laplacian stacks. This ensures that a
          good window can be found to prevent ghosting (when the window size is
          too big for the frequencies) or cropping of major details (when the
          window size is too small for the given frequencies). Blending at each
          level ensures that a good window size is chosen for the set of
          frequencies at each level. To get the blend at each level, a Gaussian
          stack of the image mask is used, which provides a larger window for
          the lower frequencies and a smaller window for the higher ones. A
          diagram of the blending at each level is shown below along with the
          gray and colored blend:
        </p>
        <ImageContainer columns={3}>
          <Image
            src={path.join(mediaBase, "/spline/orple.png")}
            alt="orple_color"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/orple_gray.png")}
            alt="orple_gray"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/orple_stack.png")}
            alt="orple_stack"
            width="800"
            height="600"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          Here is an attempt at putting leaves on a tree with an irregular mask:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/spline/tree1_copy.jpg")}
            alt="tree1"
            width="400"
            height="200"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/tree2_copy.jpeg")}
            alt="tree2"
            width="400"
            height="200"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/leaves_on_tree.png")}
            alt="leaves_on_tree"
            width="400"
            height="200"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/leaves_on_tree_stack.png")}
            alt="leaves_on_tree_stack"
            width="800"
            height="600"
            loading="lazy"
          />
        </ImageContainer>
        <p>Finally, here is a combination of a donut and bagel:</p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/spline/donut2 copy.jpeg")}
            alt="donut"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/bagel2 copy.jpeg")}
            alt="bagel"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/dogel.png")}
            alt="dogel"
            width="400"
            height="300"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/spline/dogel_stack.png")}
            alt="dogel_stack"
            width="800"
            height="800"
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
        <h1>Project 2: Fun With Filters and Frequencies</h1>
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
          <Sidebar ids={pageContent.map((article) => article.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}
