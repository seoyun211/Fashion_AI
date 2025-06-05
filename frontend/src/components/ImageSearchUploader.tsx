import React from "react";
import axios from "axios";

const ImageSearchUploader = () => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/search-image", formData);
      const { result_url } = res.data;

      // 구글 유사 이미지 검색 결과를 새 탭에 표시
      window.open(result_url, "_blank");
    } catch (err) {
      alert("유사 이미지 검색 실패! 서버를 확인해 주세요.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="text-lg font-semibold">🔍 유사한 옷 찾기</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default ImageSearchUploader;
