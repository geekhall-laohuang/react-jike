import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./index.scss";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";

import {
  createArticleAPI,
  getArticleById,
  updateArticleAPI,
} from "@/apis/article";
import { message } from "antd";
import { useChannel } from "@/hooks/useChannel";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const { Option } = Select;

const Publish = () => {
  // 渲染列表
  const { channelList } = useChannel();

  // 提交表单
  const onFinish = (formValue) => {
    console.log(formValue);
    // 校验图片数量是否匹配
    if (imageList.length !== imageType)
      return message.warning("封面类型和图片数量不匹配");
    const { title, content, channel_id } = formValue;
    // 按照文档收集数据
    const reqData = {
      title,
      content,
      cover: {
        type: imageType,
        Images: imageList.map((item) => {
          if (item.response) {
            return item.response.data.url;
          } else {
            return item.url;
          }
        }), // 图片列表
      },
      channel_id,
    };
    // 调用接口
    // 新增 新增接口  编辑 编辑接口
    if (articleId) {
      updateArticleAPI({
        ...reqData,
        id: articleId,
      });
    } else {
      createArticleAPI(reqData);
    }
  };

  // 上传回调
  const [imageList, setImageList] = useState([]);
  const onChange = (value) => {
    setImageList(value.fileList);
  };

  // 切换图片类型
  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e) => {
    setImageType(e.target.value);
  };

  // 回填数据
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");
  // 获取实例
  const [form] = Form.useForm();
  useEffect(() => {
    // 1. 通过id获取数据
    async function getArticleDetail() {
      const res = await getArticleById(articleId);
      const data = res.data;
      const { cover } = data;
      form.setFieldsValue({
        ...data,
        type: cover.type,
      });
      // 为什么现在的写法无法回填封面？
      // 数据结构的问题  set方法 -> { type: 3 }   { cover: { type: 3}}

      // 回填图片列表
      setImageType(cover.type);
      // 显示图片({url:url})
      setImageList(
        cover.images.map((url) => {
          return { url };
        })
      );
    }
    // 只有有id的时候才能调用此函数回填
    if (articleId) {
      getArticleDetail();
    }
    // 2. 调用实例方法 完成回填
  }, [articleId, form]);

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: `${articleId ? "编辑" : "发布"}文章` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 条件渲染 */}
            {imageType > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            {/* 富文本编译器 */}
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
