import { getChannelApi } from "@/apis/article";
import { useEffect, useState } from "react";

function useChannel() {
  // 渲染列表
  const [channelList, setChannelList] = useState([]);
  useEffect(() => {
    const getChannelList = async () => {
      const res = await getChannelApi();
      setChannelList(res.data.channels);
    };
    getChannelList();
  }, []);
  return {
    channelList,
  };
}

export { useChannel };
