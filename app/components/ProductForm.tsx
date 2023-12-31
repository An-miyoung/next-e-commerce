"use client";
import {
  Button,
  Input,
  Option,
  Select,
  Textarea,
} from "@material-tailwind/react";
import React, {
  useEffect,
  useState,
  useTransition,
  ChangeEventHandler,
} from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import categories from "@utils/categories";
import ImageSelector from "@components/ImageSelector";
import { NewProductInfo } from "../types";

interface Props {
  initialValue?: InitialValue;
  onSubmit(values: NewProductInfo): void;
  onImageRemove?(source: string): void;
}

export interface InitialValue {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  bulletPoints?: string[];
  mrp: number;
  price: { base: number; discounted: number };
  salePrice: number;
  category: string;
  quantity: number;
}

const defaultValue = {
  title: "",
  description: "",
  thumbnail: "",
  images: [""],
  bulletPoints: [""],
  mrp: 0,
  price: { base: 0, discounted: 0 },
  salePrice: 0,
  category: "",
  quantity: 0,
};

export default function ProductForm(props: Props) {
  const { onSubmit, onImageRemove, initialValue } = props;
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File>();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [productInfo, setProductInfo] = useState({
    ...defaultValue,
  });
  const [thumbnailSource, setThumbnailSource] = useState<string[]>();
  const [productImagesSource, setProductImagesSource] = useState<string[]>();

  const fields = productInfo.bulletPoints;

  const addMoreBulletPoints = () => {
    setProductInfo({
      ...productInfo,
      bulletPoints: productInfo.bulletPoints && [
        ...productInfo.bulletPoints,
        "",
      ],
    });
  };

  const removeBulletPoint = (indexToRemove: number) => {
    const points = productInfo.bulletPoints && [...productInfo.bulletPoints];
    const filteredPoints =
      points && points.filter((_, index) => index !== indexToRemove);
    setProductInfo({
      ...productInfo,
      bulletPoints: filteredPoints && [...filteredPoints],
    });
  };

  const updateBulletPointValue = (value: string, index: number) => {
    const oldValues = [...fields!];
    oldValues[index] = value;

    setProductInfo({
      ...productInfo,
      bulletPoints: oldValues && [...oldValues],
    });
  };

  const removeImage = async (index: number) => {
    if (!productImagesSource) return;

    // image in the clound
    const imageToRemove = productImagesSource[index];
    const cloudSorurceUrl = "https://res.cloudinary.com";
    if (imageToRemove.startsWith(cloudSorurceUrl)) {
      onImageRemove && onImageRemove(imageToRemove);
    } else {
      //  image in the local state
      const fileIndexDifference = productImagesSource.length - images.length;
      const indexToRemove = index - fileIndexDifference;
      // setImageFiles(prev => prev.filter((_, idx) => indexToRemove !== idx))
      const newImageFiles = images.filter((_, idx) => indexToRemove !== idx);
      setImages([...newImageFiles]);
    }
    //  update UI
    const newImageSource = productImagesSource.filter(
      (_, idx) => index !== idx
    );
    setProductImagesSource([...newImageSource]);
  };

  const getBtnTitle = () => {
    if (isForUpdate) return isPending ? "수정중" : "상품수정";
    return isPending ? "추가중..." : "상품추가";
  };

  useEffect(() => {
    if (initialValue) {
      // @ts-ignore
      setProductInfo({ ...initialValue });
      setThumbnailSource([initialValue.thumbnail]);
      setProductImagesSource(initialValue.images);
      setImages([]);
      setIsForUpdate(true);
    }
  }, [initialValue]);

  const onImagesChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const files = target.files;

    if (files) {
      const newImages = Array.from(files).map((item) => item);
      const oldImages = productImagesSource || [];
      setImages([...images, ...newImages]);
      setProductImagesSource([
        ...oldImages,
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const onThumbnailChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    let files = target.files;
    if (files) {
      const file = files[0];
      setThumbnail(file);
      setThumbnailSource([URL.createObjectURL(file)]);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="mb-2 text-xl">상품 상세 페이지</h1>

      <form
        action={() =>
          startTransition(async () => {
            await onSubmit({ ...productInfo, images, thumbnail });
          })
        }
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3>대표이미지</h3>
          <ImageSelector
            id="thumb"
            images={thumbnailSource}
            onChange={onThumbnailChange}
          />

          <h3>이미지들</h3>
          <ImageSelector
            multiple
            id="images"
            images={productImagesSource}
            onRemove={removeImage}
            onChange={onImagesChange}
          />
        </div>

        <Input
          label="상품명"
          value={productInfo.title}
          onChange={({ target }) =>
            setProductInfo({ ...productInfo, title: target.value })
          }
          crossOrigin={undefined}
        />

        <Textarea
          className="h-52"
          label="상품소개"
          value={productInfo.description}
          onChange={({ target }) =>
            setProductInfo({ ...productInfo, description: target.value })
          }
        />

        <Select
          onChange={(category) => {
            if (category) setProductInfo({ ...productInfo, category });
          }}
          value={productInfo.category}
          label="카테고리 선택"
        >
          {categories.map((c: any) => (
            <Option value={c} key={c}>
              {c}
            </Option>
          ))}
        </Select>

        <div className="flex space-x-4">
          <div className="space-y-4 flex-1">
            <h3>가격</h3>

            <Input
              value={productInfo.mrp}
              label="MRP"
              onChange={({ target }) => {
                const mrp = +target.value;
                setProductInfo({ ...productInfo, mrp });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
            <Input
              value={productInfo.salePrice}
              label="할인된 가격"
              onChange={({ target }) => {
                const salePrice = +target.value;
                setProductInfo({ ...productInfo, salePrice });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
          </div>

          <div className="space-y-4 flex-1">
            <h3>재고수량</h3>

            <Input
              value={productInfo.quantity}
              label="개"
              onChange={({ target }) => {
                console.log(target.value);
                const quantity = +target.value;
                if (!isNaN(quantity))
                  setProductInfo({ ...productInfo, quantity });
              }}
              className="mb-4"
              crossOrigin={undefined}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3>판매시 강점</h3>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center">
              <Input
                type="text"
                value={field}
                label={`강점 ${index + 1}`}
                onChange={({ target }) =>
                  updateBulletPointValue(target.value, index)
                }
                className="mb-4"
                crossOrigin={undefined}
              />
              {fields.length > 1 ? (
                <button
                  onClick={() => removeBulletPoint(index)}
                  type="button"
                  className="ml-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              ) : null}
            </div>
          ))}

          <button
            disabled={isPending}
            type="button"
            onClick={addMoreBulletPoints}
            className="flex items-center space-x-1 text-gray-800 ml-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>항목추가하기</span>
          </button>
        </div>

        <Button disabled={isPending} type="submit" color="blue">
          {getBtnTitle()}
        </Button>
      </form>
    </div>
  );
}
