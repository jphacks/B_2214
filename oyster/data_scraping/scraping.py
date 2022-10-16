import argparse
import random
import requests
from bs4 import BeautifulSoup
import urllib.error
import urllib.request

def get_url(soup, house_names):
    urls = []
    for div1 in soup.find_all('div', attrs={'class': 'wrapper'}):
        for div2 in div1.find_all('div', attrs={'class': 'ui-section--h1'}):
            for div3 in div2.find_all('div', attrs={'class': 'ui-section-body'}):
                for div4 in div3.find_all('div', attrs={'class': 'contents contents--type2'}):
                    for div5 in div4.find_all('div', attrs={'class': 'main'}):
                        for div6 in div5.find_all('form', attrs={'name': 'chintai_ichiran_FR301FC005ActionForm'}):
                            for div7 in div6.find_all('div', attrs={'id': 'js-bukkenList'}):
                                for div8 in div7.find_all('div', attrs={'class': 'property_group'}):
                                    for div9 in div8.find_all('div', attrs={'class': 'property property--highlight js-property js-cassetLink'}):
                                        for div10 in div9.find_all('div', attrs={'class': 'property-header'}):
                                            for div11 in div10.find_all('div', attrs={'class': 'property-header-inner'}):
                                                for div12 in div11.find_all('h2', attrs={'class': 'property_inner-title'}):
                                                    url = 'https://suumo.jp' + div12.find('a')['href']
                                                    house_name = div11.find('a').text
                                                    first_name = house_name.split(' ')[0]
                                                    if first_name not in house_names:
                                                        print(house_name)
                                                        house_names.append(first_name)
                                                        urls.append(url)
    return urls, house_names


def get_next_page_url(now_page, soup):
    for div1 in soup.find_all('body'):
        for div2 in div1.find_all('div', attrs={'class': 'wrapper'}):
            for div3 in div2.find_all('div', attrs={'class': 'ui-section--h1'}):
                for div4 in div3.find_all('div', attrs={'class': 'ui-section-body'}):
                    for div5 in div4.find_all('div', attrs={'class': 'contents contents--type2'}):
                        for div6 in div5.find_all('div', attrs={'class': 'main'}):
                            for div7 in div6.find_all('form', attrs={'name': 'chintai_ichiran_FR301FC005ActionForm'}):
                                for div8 in div7.find_all('div', attrs={'class': 'pagination_set'}):
                                    for div9 in div8.find_all('div', attrs={'class': 'pagination pagination_set-nav'}):
                                        for div10 in div9.find_all('ol', attrs={'class': 'pagination-parts'}):
                                            for div11 in div10.find_all('li'):
                                                if div11.find('a') == None:
                                                    continue
                                                if div11.find('a').text == str(now_page+1):
                                                    url = 'https://suumo.jp' + div11.find('a')['href']
                                                    return url
    return


def download_file(url, dst_path):
    try:
        with urllib.request.urlopen(url) as web_file:
            data = web_file.read()
            with open(dst_path, mode='wb') as local_file:
                local_file.write(data)
    except urllib.error.URLError as e:
        print(e)


def main(args):
    url = args.url
    res = requests.get(url)
    res.encoding = res.apparent_encoding
    soup = BeautifulSoup(res.text, "lxml")
    house_names = []
    for page in range(1,53):
        if page != 1:
            url = get_next_page_url(page-1, soup)
            res = requests.get(url)
            res.encoding = res.apparent_encoding
            soup = BeautifulSoup(res.text, "lxml")
        urls, house_names = get_url(soup, house_names)
        for u in urls:
            res = requests.get(u)
            res.encoding = res.apparent_encoding
            h_soup = BeautifulSoup(res.text, "lxml")
            for h_div1 in h_soup.find_all('body'):
                for h_div2 in h_div1.find_all('div', attrs={'id': 'wrapper'}):
                    for h_div3 in h_div2.find_all('div', attrs={'class': 'section_h1'}):
                        for h_div4 in h_div3.find_all('div', attrs={'class': 'section_h1-body'}):
                            for h_div5 in h_div4.find_all('div', attrs={'class': 'property_view'}):
                                for h_div6 in h_div5.find_all('div', attrs={'class': 'property_view-gallery js-contextmenu_hide'}):
                                    for h_div7 in h_div6.find_all('div', attrs={'class': 'property_view_gallery'}):
                                        for h_div8 in h_div7.find_all('div', attrs={'class': 'property_view_gallery-slick'}):
                                            for h_div9 in h_div8.find_all('div', attrs={'class': 'property_view_gallery-slick-view'}):
                                                for h_div10 in h_div9.find_all('ul', attrs={'class': 'l-property_view_object'}):
                                                    for h_div11 in h_div10.find_all('li'):
                                                        if not h_div11.find('img')['alt'] == '間取り図':
                                                            continue
                                                        img_url = h_div11.find('img')['data-src']
                                                        path = f'../semantic_segmentation/dataset/data_tmp/{page}_{img_url.split("/")[-1]}'
                                                        download_file(img_url, path)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('url')
    args = parser.parse_args()
    main(args)
