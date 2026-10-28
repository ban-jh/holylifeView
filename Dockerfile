# holylife Frontend Dockerfile
# Vue 3 빌드 + Nginx 서빙
# Multi-stage build

# ── Stage 1: Build Vue app ──
FROM node:22-alpine AS builder

WORKDIR /build

# package.json 복사 및 의존성 설치
COPY package.json package-lock.json* ./
RUN npm ci --silent 2>/dev/null || npm install --silent

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# ── Stage 2: Nginx serve ──
FROM nginx:alpine

# 빌드된 정적 파일 복사
COPY --from=builder /build/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]