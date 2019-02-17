import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { ICoffeeBean, IPlan, IShop } from 'interfaces';
import { HomePage, IProps as IHomePageProps } from 'presentations/components/HomePage';
import { generateLayoutProps, ILayoutProps } from 'presentations/utils/generateLayoutProps';

export const request: AxiosInstance = axios.create({
  // tslint:disable-next-line:no-http-string
  baseURL: `http://127.0.0.1:${process.env.PORT || '3030'}`,
});

export function homeHandler(req: express.Request, res: express.Response): void {
  Promise.all([request.get('/api/shops'), request.get('/api/coffee-beans'), request.get('/api/plans')]).then(
    (result: AxiosResponse[]) => {
      const shops: IShop[] = result[0].data;
      const coffeeBeans: ICoffeeBean[] = result[1].data;
      const plans: IPlan[] = result[2].data;
      const state: IHomePageProps = {
        shops,
        coffeeBeans,
        plans,
      };

      const props: ILayoutProps = generateLayoutProps();
      props.path = req.originalUrl;
      props.title = 'cycle coffee | コーヒー定期便 | ポストで受け取り、ゆったりおウチで';
      props.description = '月に2回、自信を持ってお勧めできるコーヒー豆をお届けします。';
      props.keywords = ['coffee', 'コーヒー', '珈琲', 'カフェ', 'cafe', 'うち', '定期便', 'サブスクリプション'].join(
        ',',
      );
      props.image = 'TODO';
      props.scripts = ['/pages/home/bundle.js'];
      props.stylesheets = ['/pages/home/index.css'];
      props.children = renderToString(React.createElement(HomePage, state));
      props.state = state;

      res.send(req.compiledFunction({ props }));
    },
  );
}
