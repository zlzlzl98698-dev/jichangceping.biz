import type { DefaultTheme } from 'vitepress'
import { SITE_CONFIG } from './site'

function stripMarkdownToPlainText(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]+/g, '')
    .replace(/^\s{0,3}(?:>\s?)+/, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildCondensedMarkdown(src: string, frontmatter: Record<string, unknown>): string {
  const MAX_BODY_CHARS = 850
  const body = src
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')

  const fmTitle = typeof frontmatter.title === 'string' ? frontmatter.title.trim() : ''
  const fmDesc = typeof frontmatter.description === 'string' ? frontmatter.description.trim() : ''
  const fmPrimary =
    typeof frontmatter.primaryKeyword === 'string' ? frontmatter.primaryKeyword.trim() : ''
  const fmSecondary = Array.isArray(frontmatter.secondaryKeywords)
    ? frontmatter.secondaryKeywords.map((v) => String(v).trim()).filter(Boolean)
    : []
  const fmTags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.map((v) => String(v).trim()).filter(Boolean)
    : []

  const metaParts = Array.from(
    new Set([fmTitle, fmDesc, fmPrimary, ...fmSecondary, ...fmTags].filter(Boolean))
  )
  const metaLine = metaParts.join(' · ')

  const lines = body.split(/\r?\n/)
  const out: string[] = []
  let inFence = false
  let bodyChars = 0
  let metaInserted = false
  let sawHeading = false

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (!trimmed) continue
    if (/^:::/.test(trimmed)) continue
    if (/^<[^>]+>$/.test(trimmed)) continue
    if (/^\|/.test(trimmed) || /^[:\-\s|]+$/.test(trimmed)) continue
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) continue

    // Keep H1/H2 as structural search sections; fold H3-H6 into concise plain text
    // so documentIds/storedFields stay compact without losing subsection keywords.
    const topHeadingMatch = trimmed.match(/^(#{1,2})\s+(.+)$/)
    if (topHeadingMatch) {
      sawHeading = true
      out.push(`${topHeadingMatch[1]} ${stripMarkdownToPlainText(topHeadingMatch[2])}`)
      if (!metaInserted && metaLine) {
        out.push('', metaLine)
        metaInserted = true
      }
      continue
    }

    if (bodyChars >= MAX_BODY_CHARS) continue

    const subHeadingMatch = trimmed.match(/^#{3,6}\s+(.+)$/)
    const plain = stripMarkdownToPlainText(subHeadingMatch ? subHeadingMatch[1] : trimmed)
    if (!plain) continue

    const remaining = MAX_BODY_CHARS - bodyChars
    const slice = plain.length > remaining ? plain.slice(0, remaining) : plain
    out.push(slice)
    bodyChars += slice.length
  }

  if (!sawHeading) {
    const fallbackHeading = `# ${fmTitle || '机场测评'}`
    return [fallbackHeading, '', metaLine, '', ...out].filter(Boolean).join('\n')
  }

  if (!metaInserted && metaLine) {
    out.unshift(`# ${fmTitle || '机场测评'}`, '', metaLine, '')
  }

  return out.join('\n')
}

export function createSearchConfig(): DefaultTheme.Config['search'] {
  if (SITE_CONFIG.algolia.enabled) {
    return {
      provider: 'algolia',
      options: {
        appId: SITE_CONFIG.algolia.appId,
        apiKey: SITE_CONFIG.algolia.apiKey,
        indexName: SITE_CONFIG.algolia.indexName,
        placeholder: '搜索机场品牌、套餐、客户端教程或故障排查...',
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索全站内容'
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清空查询',
              resetButtonAriaLabel: '清空查询',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '最近搜索',
              noRecentSearchesText: '暂无搜索历史',
              saveRecentSearchButtonTitle: '保存到历史',
              removeRecentSearchButtonTitle: '从历史移除',
              favoriteSearchesTitle: '收藏搜索',
              removeFavoriteSearchButtonTitle: '取消收藏'
            },
            errorScreen: {
              titleText: '无法连接搜索服务',
              helpText: '请检查网络连接或稍后重试'
            },
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '确认',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上一条',
              navigateDownKeyAriaLabel: '下一条',
              closeText: '关闭',
              closeKeyAriaLabel: '关闭搜索弹窗',
              searchByText: '搜索提供方'
            },
            noResultsScreen: {
              noResultsText: '未找到匹配结果',
              suggestedQueryText: '建议尝试关键词',
              reportMissingResultsText: '缺少想要的内容？',
              reportMissingResultsLinkText: '反馈给我们'
            }
          }
        }
      }
    }
  }

  return {
    provider: 'local',
    options: {
      detailedView: true,
      _render(src, env, md) {
        const probeEnv = { ...env }
        md.render(src, probeEnv)
        const frontmatter = (probeEnv.frontmatter ?? {}) as Record<string, unknown>
        if (frontmatter.search === false) return ''
        const condensed = buildCondensedMarkdown(src, frontmatter)
        return md.render(condensed, env)
      },
      miniSearch: {
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: {
            title: 4,
            text: 2,
            titles: 1
          }
        }
      },
      translations: {
        button: {
          buttonText: '搜索测评与教程',
          buttonAriaLabel: '搜索全站内容'
        },
        modal: {
          displayDetails: '显示详细摘要',
          resetButtonTitle: '清空搜索条件',
          backButtonTitle: '关闭搜索',
          noResultsText: '未找到匹配内容，可尝试输入品牌名、客户端名称或错误关键字',
          footer: {
            selectText: '打开',
            selectKeyAriaLabel: '按回车打开',
            navigateText: '切换',
            navigateUpKeyAriaLabel: '上一项',
            navigateDownKeyAriaLabel: '下一项',
            closeText: '关闭',
            closeKeyAriaLabel: '按 Esc 关闭'
          }
        }
      }
    }
  }
}

export const SEARCH_CONFIG = createSearchConfig()
